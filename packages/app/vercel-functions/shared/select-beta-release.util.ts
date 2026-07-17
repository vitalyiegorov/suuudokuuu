import {
    DevelopmentApkAssetName,
    DevelopmentChecksumsAssetName,
    DevelopmentIpaAssetName,
    DevelopmentReleaseAssetNames,
    DevelopmentReleaseTagPattern,
    MaximumChecksumsByteLength
} from './beta-release.constant';
import { githubReleaseSchema, githubReleasesSchema } from './github-release.schema';
import { parseReleaseMetadata } from './parse-release-metadata.util';
import { validateReleaseAssetUrl } from './validate-release-asset-url.util';

import type { BetaReleaseCandidate } from './beta-release.interface';
import type { GithubRelease, GithubReleaseAsset } from './github-release.schema';

interface NumberedBetaReleaseCandidate {
    readonly artifactAttempt: number;
    readonly candidate: BetaReleaseCandidate;
    readonly publishAttempt: number;
    readonly tagNumber: number;
}

interface CandidateAssets {
    readonly apk: GithubReleaseAsset;
    readonly checksums: GithubReleaseAsset;
    readonly ipa: GithubReleaseAsset;
}

export type BetaReleaseCandidatesParseResult =
    { readonly candidates: readonly BetaReleaseCandidate[]; readonly status: 'valid' } | { readonly status: 'invalid' };

const parseTagNumber = (tagName: string): Pick<NumberedBetaReleaseCandidate, 'artifactAttempt' | 'publishAttempt' | 'tagNumber'> | null => {
    const tagMatch = DevelopmentReleaseTagPattern.exec(tagName);
    const tagNumberText = tagMatch?.at(1) ?? null;
    const artifactAttemptText = tagMatch?.at(2) ?? null;
    const publishAttemptText = tagMatch?.at(3) ?? null;
    if (tagNumberText === null || artifactAttemptText === null || publishAttemptText === null) {
        return null;
    }

    const tagNumber = Number(tagNumberText);
    const artifactAttempt = Number(artifactAttemptText);
    const publishAttempt = Number(publishAttemptText);

    return Number.isSafeInteger(tagNumber) && Number.isSafeInteger(artifactAttempt) && Number.isSafeInteger(publishAttempt)
        ? { artifactAttempt, publishAttempt, tagNumber }
        : null;
};

const findReleaseAsset = (release: GithubRelease, assetName: string): GithubReleaseAsset | null =>
    release.assets.find(asset => asset.name === assetName) ?? null;

const getCandidateAssets = (release: GithubRelease): CandidateAssets | null => {
    const ipaAsset = findReleaseAsset(release, DevelopmentIpaAssetName);
    const apkAsset = findReleaseAsset(release, DevelopmentApkAssetName);
    const checksumsAsset = findReleaseAsset(release, DevelopmentChecksumsAssetName);
    if (ipaAsset === null || apkAsset === null || checksumsAsset === null) {
        return null;
    }

    return { apk: apkAsset, checksums: checksumsAsset, ipa: ipaAsset };
};

const hasExactAssets = (release: GithubRelease) => {
    const uniqueAssetNames = new Set(release.assets.map(asset => asset.name));
    const hasExpectedAssetNames = DevelopmentReleaseAssetNames.every(assetName => uniqueAssetNames.has(assetName));

    return (
        release.assets.length === DevelopmentReleaseAssetNames.length &&
        uniqueAssetNames.size === DevelopmentReleaseAssetNames.length &&
        hasExpectedAssetNames &&
        release.assets.every(
            asset => asset.size > 0 && (asset.name !== DevelopmentChecksumsAssetName || asset.size <= MaximumChecksumsByteLength)
        )
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

const isEligibleRelease = (
    release: GithubRelease,
    tag: Pick<NumberedBetaReleaseCandidate, 'artifactAttempt' | 'publishAttempt' | 'tagNumber'> | null
) => !release.draft && release.prerelease && tag !== null && release.body !== null && hasExactAssets(release);

const createCandidate = (
    release: GithubRelease,
    tag: Pick<NumberedBetaReleaseCandidate, 'artifactAttempt' | 'tagNumber'>,
    assets: CandidateAssets,
    parsedMetadata: ReturnType<typeof parseReleaseMetadata>
): BetaReleaseCandidate | null => {
    if (parsedMetadata === null || release.name === null || release.published_at === null) {
        return null;
    }
    if (!hasValidAssetUrls(release.tag_name, assets.ipa, assets.apk, assets.checksums)) {
        return null;
    }

    if (parsedMetadata.metadata.bundleVersion !== `${tag.tagNumber}.${tag.artifactAttempt}`) {
        return null;
    }

    return {
        ...parsedMetadata.metadata,
        apkUrl: assets.apk.browser_download_url,
        checksumsUrl: assets.checksums.browser_download_url,
        ipaUrl: assets.ipa.browser_download_url,
        name: release.name,
        publishedAt: release.published_at,
        releaseNotes: parsedMetadata.releaseNotes,
        runNumber: tag.tagNumber,
        tagName: release.tag_name
    };
};

const createNumberedCandidate = (release: GithubRelease): NumberedBetaReleaseCandidate | null => {
    const tag = parseTagNumber(release.tag_name);
    const assets = getCandidateAssets(release);
    if (!isEligibleRelease(release, tag) || tag === null || release.body === null || assets === null) {
        return null;
    }

    const parsedMetadata = parseReleaseMetadata(release.body);

    const candidate = createCandidate(release, tag, assets, parsedMetadata);
    if (candidate === null) {
        return null;
    }

    return {
        artifactAttempt: tag.artifactAttempt,
        candidate,
        publishAttempt: tag.publishAttempt,
        tagNumber: tag.tagNumber
    };
};

const compareCandidates = (first: NumberedBetaReleaseCandidate, second: NumberedBetaReleaseCandidate) => {
    if (first.tagNumber !== second.tagNumber) {
        return first.tagNumber > second.tagNumber ? -1 : 1;
    }

    if (first.artifactAttempt !== second.artifactAttempt) {
        return first.artifactAttempt > second.artifactAttempt ? -1 : 1;
    }

    if (first.publishAttempt === second.publishAttempt) {
        return 0;
    }

    return first.publishAttempt > second.publishAttempt ? -1 : 1;
};

const parseNumberedCandidate = (input: unknown): NumberedBetaReleaseCandidate | null => {
    const releaseResult = githubReleaseSchema.safeParse(input);

    return releaseResult.success ? createNumberedCandidate(releaseResult.data) : null;
};

const createCandidates = (releases: readonly unknown[]): readonly BetaReleaseCandidate[] =>
    releases
        .flatMap(input => {
            const numberedCandidate = parseNumberedCandidate(input);

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
