import {
    DevelopmentApkAssetName,
    DevelopmentChecksumsAssetName,
    DevelopmentIpaAssetName,
    DevelopmentReleaseAssetNames,
    DevelopmentReleaseTagPattern
} from './beta-release.constant';
import { githubReleasesSchema } from './github-release.schema';
import { parseReleaseMetadata } from './parse-release-metadata.util';
import { validateReleaseAssetUrl } from './validate-release-asset-url.util';

import type { BetaReleaseCandidate } from './beta-release.interface';
import type { GithubRelease, GithubReleaseAsset } from './github-release.schema';

interface NumberedBetaReleaseCandidate {
    readonly candidate: BetaReleaseCandidate;
    readonly tagNumber: bigint;
}

export type BetaReleaseCandidatesParseResult =
    { readonly candidates: readonly BetaReleaseCandidate[]; readonly status: 'valid' } | { readonly status: 'invalid' };

const parseTagNumber = (tagName: string): bigint | null => {
    const tagMatch = DevelopmentReleaseTagPattern.exec(tagName);
    const tagNumber = tagMatch?.at(1) ?? null;

    return tagNumber === null ? null : BigInt(tagNumber);
};

const findReleaseAsset = (release: GithubRelease, assetName: string): GithubReleaseAsset | null =>
    release.assets.find(asset => asset.name === assetName) ?? null;

const hasExactAssets = (release: GithubRelease) => {
    const uniqueAssetNames = new Set(release.assets.map(asset => asset.name));
    const hasExpectedAssetNames = DevelopmentReleaseAssetNames.every(assetName => uniqueAssetNames.has(assetName));

    return (
        release.assets.length === DevelopmentReleaseAssetNames.length &&
        uniqueAssetNames.size === DevelopmentReleaseAssetNames.length &&
        hasExpectedAssetNames &&
        release.assets.every(asset => asset.size > 0)
    );
};

const hasValidAssetUrls = (
    tagName: string,
    ipaAsset: GithubReleaseAsset,
    apkAsset: GithubReleaseAsset,
    checksumsAsset: GithubReleaseAsset
) =>
    validateReleaseAssetUrl(ipaAsset.browser_download_url, tagName, DevelopmentIpaAssetName) &&
    validateReleaseAssetUrl(apkAsset.browser_download_url, tagName, DevelopmentApkAssetName) &&
    validateReleaseAssetUrl(checksumsAsset.browser_download_url, tagName, DevelopmentChecksumsAssetName);

const isEligibleRelease = (release: GithubRelease, tagNumber: bigint | null) =>
    !release.draft && release.prerelease && tagNumber !== null && release.body !== null && hasExactAssets(release);

const createNumberedCandidate = (release: GithubRelease): NumberedBetaReleaseCandidate | null => {
    const tagNumber = parseTagNumber(release.tag_name);
    if (!isEligibleRelease(release, tagNumber) || tagNumber === null || release.body === null) {
        return null;
    }

    const ipaAsset = findReleaseAsset(release, DevelopmentIpaAssetName);
    const apkAsset = findReleaseAsset(release, DevelopmentApkAssetName);
    const checksumsAsset = findReleaseAsset(release, DevelopmentChecksumsAssetName);
    const parsedMetadata = parseReleaseMetadata(release.body);
    if (ipaAsset === null || apkAsset === null || checksumsAsset === null || parsedMetadata === null) {
        return null;
    }
    if (release.name === null || release.published_at === null) {
        return null;
    }
    if (!hasValidAssetUrls(release.tag_name, ipaAsset, apkAsset, checksumsAsset)) {
        return null;
    }

    return {
        candidate: {
            ...parsedMetadata.metadata,
            apkUrl: apkAsset.browser_download_url,
            checksumsUrl: checksumsAsset.browser_download_url,
            ipaUrl: ipaAsset.browser_download_url,
            name: release.name,
            publishedAt: release.published_at,
            releaseNotes: parsedMetadata.releaseNotes,
            tagName: release.tag_name
        },
        tagNumber
    };
};

const compareCandidates = (first: NumberedBetaReleaseCandidate, second: NumberedBetaReleaseCandidate) => {
    if (first.tagNumber === second.tagNumber) {
        return 0;
    }

    return first.tagNumber > second.tagNumber ? -1 : 1;
};

const createCandidates = (releases: readonly GithubRelease[]): readonly BetaReleaseCandidate[] =>
    releases
        .flatMap(release => {
            const numberedCandidate = createNumberedCandidate(release);

            return numberedCandidate === null ? [] : [numberedCandidate];
        })
        .sort(compareCandidates)
        .map(numberedCandidate => numberedCandidate.candidate);

export const parseBetaReleaseCandidates = (input: unknown): BetaReleaseCandidatesParseResult => {
    const releasesResult = githubReleasesSchema.safeParse(input);
    if (!releasesResult.success) {
        return { status: 'invalid' };
    }

    return { candidates: createCandidates(releasesResult.data), status: 'valid' };
};

export const selectBetaReleaseCandidates = (input: unknown): readonly BetaReleaseCandidate[] => {
    const parseResult = parseBetaReleaseCandidates(input);

    return parseResult.status === 'valid' ? parseResult.candidates : [];
};
