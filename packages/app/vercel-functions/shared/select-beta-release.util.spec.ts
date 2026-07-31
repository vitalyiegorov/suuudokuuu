import { describe, expect, it } from '@jest/globals';

import {
    DevelopmentApkAssetName,
    DevelopmentChecksumsAssetName,
    DevelopmentIpaAssetName,
    MaximumChecksumsByteLength
} from './beta-release.constant.js';
import { parseBetaReleaseCandidates, selectBetaReleaseCandidates } from './select-beta-release.util.js';

const CommitSha = '0123456789abcdef0123456789abcdef01234567';
const PublishedAt = '2026-07-14T10:30:00Z';
const CurrentRunNumber = 123;
const InvalidNewestRunNumber = 200;
const OlderRunNumber = 199;

interface ReleaseOverrides {
    readonly artifactAttempt?: number;
    readonly assets?: readonly unknown[];
    readonly body?: string | null;
    readonly bundleVersion?: string;
    readonly draft?: boolean;
    readonly prerelease?: boolean;
    readonly publishedAt?: string;
    readonly publishAttempt?: number;
    readonly tagName?: string;
}

const createMetadata = (runNumber: number, bundleVersion = `${runNumber}.1`) => ({
    branch: 'main',
    bundleVersion,
    builtAt: '2026-07-14T10:20:30.000Z',
    commitSha: CommitSha,
    version: '1.62.5',
    workflowUrl: `https://github.com/vitalyiegorov/suuudokuuu/actions/runs/${runNumber + 1000}`
});

const createAsset = (tagName: string, name: string, size = 100) => ({
    browser_download_url: `https://github.com/vitalyiegorov/suuudokuuu/releases/download/${tagName}/${name}`,
    extraAssetField: 'allowed',
    name,
    size
});

const createAssets = (tagName: string) => [
    createAsset(tagName, DevelopmentIpaAssetName),
    createAsset(tagName, DevelopmentApkAssetName),
    createAsset(tagName, DevelopmentChecksumsAssetName)
];

const createRelease = (runNumber: number, overrides: ReleaseOverrides = {}) => {
    const artifactAttempt = overrides.artifactAttempt ?? 1;
    const publishAttempt = overrides.publishAttempt ?? 1;
    const tagName = overrides.tagName ?? `development-${runNumber}-${artifactAttempt}-${publishAttempt}`;
    const metadata = createMetadata(runNumber, overrides.bundleVersion ?? `${runNumber}.${artifactAttempt}`);

    return {
        assets: overrides.assets ?? createAssets(tagName),
        author: { login: 'not-exposed' },
        body:
            overrides.body === undefined ? `<!-- suuudokuuu-development-metadata ${JSON.stringify(metadata)} -->\n\nNotes` : overrides.body,
        draft: overrides.draft ?? false,
        html_url: `https://github.com/vitalyiegorov/suuudokuuu/releases/tag/${tagName}`,
        name: `Development ${runNumber}`,
        prerelease: overrides.prerelease ?? true,
        published_at: overrides.publishedAt ?? PublishedAt,
        tag_name: tagName
    };
};

describe('selectBetaReleaseCandidates', () => {
    it('accepts real GitHub extra fields and returns sanitized candidates', () => {
        expect(selectBetaReleaseCandidates([createRelease(CurrentRunNumber)])).toEqual([
            {
                apkUrl: 'https://github.com/vitalyiegorov/suuudokuuu/releases/download/development-123-1-1/suuudokuuu-development.apk',
                branch: 'main',
                bundleVersion: '123.1',
                builtAt: '2026-07-14T10:20:30.000Z',
                checksumsUrl: 'https://github.com/vitalyiegorov/suuudokuuu/releases/download/development-123-1-1/SHA256SUMS',
                commitSha: CommitSha,
                ipaUrl: 'https://github.com/vitalyiegorov/suuudokuuu/releases/download/development-123-1-1/suuudokuuu-development.ipa',
                name: 'Development 123',
                publishedAt: PublishedAt,
                releaseNotes: 'Notes',
                runNumber: 123,
                tagName: 'development-123-1-1',
                version: '1.62.5',
                workflowUrl: 'https://github.com/vitalyiegorov/suuudokuuu/actions/runs/1123'
            }
        ]);
    });

    it('sorts valid candidates by numeric tag descending', () => {
        const candidates = selectBetaReleaseCandidates([createRelease(9), createRelease(100), createRelease(10)]);

        expect(candidates.map(candidate => candidate.tagName)).toEqual(['development-100-1-1', 'development-10-1-1', 'development-9-1-1']);
    });

    it('sorts equal-run candidates by artifact and publish attempt descending', () => {
        const candidates = selectBetaReleaseCandidates([
            createRelease(CurrentRunNumber, { artifactAttempt: 2, publishAttempt: 1 }),
            createRelease(CurrentRunNumber, { artifactAttempt: 1, publishAttempt: 2 }),
            createRelease(CurrentRunNumber, { artifactAttempt: 2, publishAttempt: 2 })
        ]);

        expect(candidates.map(candidate => candidate.tagName)).toEqual([
            'development-123-2-2',
            'development-123-2-1',
            'development-123-1-2'
        ]);
    });

    it('preserves order for candidates with equal tag components', () => {
        const candidates = selectBetaReleaseCandidates([
            createRelease(CurrentRunNumber, { publishedAt: '2026-07-14T10:30:01Z' }),
            createRelease(CurrentRunNumber, { publishedAt: '2026-07-14T10:30:02Z' })
        ]);

        expect(candidates.map(candidate => candidate.publishedAt)).toEqual(['2026-07-14T10:30:01Z', '2026-07-14T10:30:02Z']);
    });

    it.each([
        createRelease(3, { draft: true }),
        createRelease(3, { prerelease: false }),
        createRelease(3, { tagName: 'development-latest' }),
        createRelease(3, { tagName: 'development-3' }),
        createRelease(3, { tagName: 'development-3-0-1' }),
        createRelease(3, { tagName: 'development-3-1-0' }),
        createRelease(3, { tagName: 'development-3-1-1-extra' }),
        createRelease(3, { body: null }),
        createRelease(3, { body: 'Notes without metadata' }),
        createRelease(3, { assets: createAssets('development-3-1-1').slice(0, 2) }),
        createRelease(3, {
            assets: [...createAssets('development-3-1-1'), createAsset('development-3-1-1', 'extra.txt')]
        }),
        createRelease(3, {
            assets: [
                createAsset('development-3-1-1', DevelopmentIpaAssetName),
                createAsset('development-3-1-1', DevelopmentIpaAssetName),
                createAsset('development-3-1-1', DevelopmentChecksumsAssetName)
            ]
        }),
        createRelease(3, {
            assets: [
                createAsset('development-3-1-1', DevelopmentIpaAssetName, 0),
                createAsset('development-3-1-1', DevelopmentApkAssetName),
                createAsset('development-3-1-1', DevelopmentChecksumsAssetName)
            ]
        }),
        createRelease(3, {
            assets: [
                createAsset('development-3-1-1', DevelopmentIpaAssetName),
                createAsset('development-3-1-1', DevelopmentApkAssetName),
                createAsset('development-3-1-1', DevelopmentChecksumsAssetName, MaximumChecksumsByteLength + 1)
            ]
        }),
        createRelease(3, { publishedAt: '2026-07-14T10:30:00+02:00' }),
        createRelease(3, {
            assets: createAssets('development-3-1-1').map(asset => ({
                ...asset,
                browser_download_url: `${asset.browser_download_url}?x=1`
            }))
        })
    ])('filters incomplete or ineligible releases', release => {
        expect(selectBetaReleaseCandidates([release])).toEqual([]);
    });

    it('falls back past an invalid newest structural release', () => {
        const candidates = selectBetaReleaseCandidates([
            createRelease(InvalidNewestRunNumber, { body: 'invalid' }),
            createRelease(OlderRunNumber)
        ]);

        expect(candidates.map(candidate => candidate.tagName)).toEqual(['development-199-1-1']);
    });

    it('rejects a bundle version whose run component differs from the release tag', () => {
        expect(selectBetaReleaseCandidates([createRelease(CurrentRunNumber, { bundleVersion: '122.1' })])).toEqual([]);
    });

    it('falls back to an older release after a tag and bundle-version mismatch', () => {
        const candidates = selectBetaReleaseCandidates([
            createRelease(InvalidNewestRunNumber, { bundleVersion: '199.1' }),
            createRelease(OlderRunNumber)
        ]);

        expect(candidates.map(candidate => candidate.tagName)).toEqual(['development-199-1-1']);
    });

    it('skips a malformed newest release and selects an older valid release', () => {
        const candidates = selectBetaReleaseCandidates([{ tag_name: 'development-300-1-1' }, createRelease(OlderRunNumber)]);

        expect(candidates.map(candidate => candidate.tagName)).toEqual(['development-199-1-1']);
    });

    it.each([{}, null])('returns no candidates for a malformed top-level GitHub response', input => {
        expect(selectBetaReleaseCandidates(input)).toEqual([]);
        expect(parseBetaReleaseCandidates(input)).toEqual({ status: 'invalid' });
    });

    it.each([{ input: [{ tag_name: 'development-1-1-1' }] }, { input: [{ ...createRelease(1), assets: 'invalid' }] }])(
        'treats an array with malformed releases as a valid empty candidate set',
        ({ input }) => {
            expect(parseBetaReleaseCandidates(input)).toEqual({ candidates: [], status: 'valid' });
        }
    );

    it('distinguishes a valid empty GitHub response', () => {
        expect(parseBetaReleaseCandidates([])).toEqual({ candidates: [], status: 'valid' });
    });
});
