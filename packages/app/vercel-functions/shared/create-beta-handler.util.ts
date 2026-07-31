import {
    BetaAllowHeaderName,
    BetaAllowedMethods,
    BetaMethodNotAllowedErrorMessage,
    BetaNotFoundErrorMessage,
    BetaUpstreamFailureErrorMessage,
    GithubReleasesTokenEnvironmentVariable,
    HttpBadGatewayStatus,
    HttpMethodNotAllowedStatus,
    HttpNotFoundStatus,
    HttpOkStatus
} from './beta-release.constant.js';
import { createBetaHeadResponse, createBetaJsonResponse, createBetaRedirectResponse, createBetaXmlResponse } from './beta-response.util.js';
import { resolveBetaRelease } from './resolve-beta-release.util.js';
import { serializeOtaManifest } from './serialize-ota-manifest.util.js';

import type { BetaRelease, ResolveBetaReleaseResult } from './beta-release.interface.js';

type BetaEndpointKind = 'release' | 'ipa' | 'apk' | 'manifest';
type BetaReleaseResolver = () => Promise<ResolveBetaReleaseResult>;
export type BetaHandler = (request: Request) => Promise<Response>;

const createPublicRelease = (release: BetaRelease) => ({
    branch: release.branch,
    builtAt: release.builtAt,
    checksums: release.checksums,
    commitSha: release.commitSha,
    commitShortSha: release.commitSha.slice(0, 7),
    installUrls: { android: '/api/beta/apk', iosManifest: '/ota/manifest.plist' },
    name: release.name,
    publishedAt: release.publishedAt,
    releaseNotes: release.releaseNotes,
    runNumber: release.runNumber,
    tagName: release.tagName,
    version: release.version,
    workflowUrl: release.workflowUrl
});

const createReadyResponse = (endpointKind: BetaEndpointKind, release: BetaRelease) => {
    if (endpointKind === 'release') {
        return createBetaJsonResponse(createPublicRelease(release), HttpOkStatus, true);
    }
    if (endpointKind === 'ipa') {
        return createBetaRedirectResponse(release.ipaUrl);
    }
    if (endpointKind === 'manifest') {
        return createBetaXmlResponse(serializeOtaManifest(release));
    }

    return createBetaRedirectResponse(release.apkUrl);
};

const createResolvedResponse = (endpointKind: BetaEndpointKind, result: ResolveBetaReleaseResult) => {
    if (result.status === 'ready') {
        return createReadyResponse(endpointKind, result.release);
    }
    if (result.status === 'not-found') {
        return createBetaJsonResponse({ error: BetaNotFoundErrorMessage }, HttpNotFoundStatus);
    }

    return createBetaJsonResponse({ error: BetaUpstreamFailureErrorMessage }, HttpBadGatewayStatus);
};

const getGithubReleasesToken = () => {
    const githubToken: unknown = process.env[GithubReleasesTokenEnvironmentVariable];

    return typeof githubToken === 'string' ? githubToken : null;
};

export const resolveBetaReleaseFromEnvironment = () => {
    const githubToken = getGithubReleasesToken();

    return resolveBetaRelease({ fetch, ...(githubToken !== null && { githubToken }) });
};

export const createBetaHandler =
    (endpointKind: BetaEndpointKind, resolveRelease: BetaReleaseResolver = resolveBetaReleaseFromEnvironment): BetaHandler =>
    async request => {
        if (request.method !== 'GET' && request.method !== 'HEAD') {
            const response = createBetaJsonResponse({ error: BetaMethodNotAllowedErrorMessage }, HttpMethodNotAllowedStatus);
            response.headers.set(BetaAllowHeaderName, BetaAllowedMethods);

            return response;
        }

        const result = await resolveRelease();
        const response = createResolvedResponse(endpointKind, result);

        return request.method === 'HEAD' ? createBetaHeadResponse(response) : response;
    };
