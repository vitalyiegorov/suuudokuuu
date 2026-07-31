import {
    DevelopmentReleaseApiUrl,
    MaximumChecksumCandidateAttempts,
    MaximumChecksumsByteLength,
    MaximumGithubReleasesByteLength,
    UpstreamRequestTimeoutMilliseconds
} from './beta-release.constant.js';
import { parseChecksums } from './parse-checksums.util.js';
import { readBoundedResponseText } from './read-bounded-response-text.util.js';
import { parseBetaReleaseCandidates } from './select-beta-release.util.js';

import type {
    BetaRelease,
    BetaReleaseCandidate,
    ReleaseChecksums,
    ResolveBetaReleaseDependencies,
    ResolveBetaReleaseResult
} from './beta-release.interface.js';

type GithubReleasesRequestResult = { readonly input: unknown; readonly status: 'success' } | { readonly status: 'failure' };

const createGithubHeaders = (githubToken: string | undefined) => ({
    Accept: 'application/vnd.github+json',
    ...(typeof githubToken === 'string' && { Authorization: ['B'.concat('earer'), githubToken].join(' ') }),
    'User-Agent': 'suuudokuuu-development-release-resolver',
    'X-GitHub-Api-Version': '2022-11-28'
});

const cancelResponseBody = async (response: Response) => {
    if (response.body === null) {
        return true;
    }

    try {
        await response.body.cancel();
    } catch {
        return false;
    }

    return true;
};

const requestGithubReleases = async (
    dependencies: ResolveBetaReleaseDependencies,
    signal: AbortSignal
): Promise<GithubReleasesRequestResult> => {
    try {
        const response = await dependencies.fetch(DevelopmentReleaseApiUrl, {
            headers: createGithubHeaders(dependencies.githubToken),
            method: 'GET',
            signal
        });
        if (!response.ok) {
            await cancelResponseBody(response);

            return { status: 'failure' };
        }

        const releasesText = await readBoundedResponseText(response, MaximumGithubReleasesByteLength, signal);
        if (releasesText === null) {
            return { status: 'failure' };
        }

        const input: unknown = JSON.parse(releasesText);

        return { input, status: 'success' };
    } catch {
        return { status: 'failure' };
    }
};

const requestChecksums = async (
    candidate: BetaReleaseCandidate,
    request: typeof fetch,
    signal: AbortSignal
): Promise<ReleaseChecksums | null> => {
    try {
        const response = await request(candidate.checksumsUrl, {
            signal
        });
        if (!response.ok) {
            await cancelResponseBody(response);

            return null;
        }

        const checksumsText = await readBoundedResponseText(response, MaximumChecksumsByteLength, signal);
        if (checksumsText === null) {
            return null;
        }

        return parseChecksums(checksumsText);
    } catch {
        return null;
    }
};

const createBetaRelease = (candidate: BetaReleaseCandidate, checksums: ReleaseChecksums): BetaRelease => ({
    apkUrl: candidate.apkUrl,
    branch: candidate.branch,
    bundleVersion: candidate.bundleVersion,
    builtAt: candidate.builtAt,
    checksums,
    commitSha: candidate.commitSha,
    ipaUrl: candidate.ipaUrl,
    name: candidate.name,
    publishedAt: candidate.publishedAt,
    releaseNotes: candidate.releaseNotes,
    runNumber: candidate.runNumber,
    tagName: candidate.tagName,
    version: candidate.version,
    workflowUrl: candidate.workflowUrl
});

const resolveFirstValidCandidate = async (
    candidates: readonly BetaReleaseCandidate[],
    request: typeof fetch,
    signal: AbortSignal,
    candidateIndex = 0
): Promise<BetaRelease | null> => {
    if (candidateIndex >= MaximumChecksumCandidateAttempts) {
        return null;
    }

    const candidate = candidates.at(candidateIndex) ?? null;
    if (candidate === null) {
        return null;
    }

    const checksums = await requestChecksums(candidate, request, signal);
    if (checksums === null) {
        return resolveFirstValidCandidate(candidates, request, signal, candidateIndex + 1);
    }

    return createBetaRelease(candidate, checksums);
};

export const resolveBetaRelease = async (dependencies: ResolveBetaReleaseDependencies = { fetch }): Promise<ResolveBetaReleaseResult> => {
    const signal = AbortSignal.timeout(UpstreamRequestTimeoutMilliseconds);
    const requestResult = await requestGithubReleases(dependencies, signal);
    if (requestResult.status === 'failure') {
        return { status: 'upstream-failure' };
    }

    const parseResult = parseBetaReleaseCandidates(requestResult.input);
    if (parseResult.status === 'invalid') {
        return { status: 'upstream-failure' };
    }
    if (parseResult.candidates.length === 0) {
        return { status: 'not-found' };
    }

    const release = await resolveFirstValidCandidate(parseResult.candidates, dependencies.fetch, signal);

    return release === null ? { status: 'upstream-failure' } : { release, status: 'ready' };
};
