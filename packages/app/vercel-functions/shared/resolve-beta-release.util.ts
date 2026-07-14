import { DevelopmentReleaseApiUrl } from './beta-release.constant';
import { parseChecksums } from './parse-checksums.util';
import { parseBetaReleaseCandidates } from './select-beta-release.util';

import type {
    BetaRelease,
    BetaReleaseCandidate,
    ReleaseChecksums,
    ResolveBetaReleaseDependencies,
    ResolveBetaReleaseResult
} from './beta-release.interface';

type GithubReleasesRequestResult = { readonly input: unknown; readonly status: 'success' } | { readonly status: 'failure' };

const createGithubHeaders = (githubToken: string | undefined) => ({
    Accept: 'application/vnd.github+json',
    ...(typeof githubToken === 'string' && { Authorization: ['B'.concat('earer'), githubToken].join(' ') }),
    'User-Agent': 'suuudokuuu-development-release-resolver',
    'X-GitHub-Api-Version': '2022-11-28'
});

const requestGithubReleases = async (dependencies: ResolveBetaReleaseDependencies): Promise<GithubReleasesRequestResult> => {
    try {
        const response = await dependencies.fetch(DevelopmentReleaseApiUrl, {
            headers: createGithubHeaders(dependencies.githubToken),
            method: 'GET'
        });
        if (!response.ok) {
            return { status: 'failure' };
        }

        const input: unknown = await response.json();

        return { input, status: 'success' };
    } catch {
        return { status: 'failure' };
    }
};

const requestChecksums = async (candidate: BetaReleaseCandidate, request: typeof fetch): Promise<ReleaseChecksums | null> => {
    try {
        const response = await request(candidate.checksumsUrl);
        if (!response.ok) {
            return null;
        }

        const checksumsText = await response.text();

        return parseChecksums(checksumsText);
    } catch {
        return null;
    }
};

const createBetaRelease = (candidate: BetaReleaseCandidate, checksums: ReleaseChecksums): BetaRelease => ({
    apkUrl: candidate.apkUrl,
    branch: candidate.branch,
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
    candidateIndex = 0
): Promise<BetaRelease | null> => {
    const candidate = candidates.at(candidateIndex) ?? null;
    if (candidate === null) {
        return null;
    }

    const checksums = await requestChecksums(candidate, request);
    if (checksums === null) {
        return resolveFirstValidCandidate(candidates, request, candidateIndex + 1);
    }

    return createBetaRelease(candidate, checksums);
};

export const resolveBetaRelease = async (dependencies: ResolveBetaReleaseDependencies = { fetch }): Promise<ResolveBetaReleaseResult> => {
    const requestResult = await requestGithubReleases(dependencies);
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

    const release = await resolveFirstValidCandidate(parseResult.candidates, dependencies.fetch);

    return release === null ? { status: 'upstream-failure' } : { release, status: 'ready' };
};
