import { describe, expect, it } from '@jest/globals';

import { DevelopmentApkAssetName, DevelopmentChecksumsAssetName, DevelopmentIpaAssetName } from './beta-release.constant';
import { parseBetaReleaseCandidates, selectBetaReleaseCandidates } from './select-beta-release.util';

const CommitSha = '0123456789abcdef0123456789abcdef01234567';
const PublishedAt = '2026-07-14T10:30:00Z';
const CurrentRunNumber = 123;
const InvalidNewestRunNumber = 200;
const OlderRunNumber = 199;

interface ReleaseOverrides {
    readonly assets?: readonly unknown[];
    readonly body?: string | null;
    readonly draft?: boolean;
    readonly prerelease?: boolean;
    readonly tagName?: string;
}

const createMetadata = (runNumber: number) => ({
    branch: 'main',
    builtAt: '2026-07-14T10:20:30.000Z',
    commitSha: CommitSha,
    runNumber,
    version: '1.62.5',
    workflowUrl: `https://github.com/vitalyiegorov/suuudokuuu/actions/runs/${runNumber}`
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
    const tagName = overrides.tagName ?? `development-${runNumber}`;
    const metadata = createMetadata(runNumber);

    return {
        assets: overrides.assets ?? createAssets(tagName),
        author: { login: 'not-exposed' },
        body:
            overrides.body === undefined ? `<!-- suuudokuuu-development-metadata ${JSON.stringify(metadata)} -->\n\nNotes` : overrides.body,
        draft: overrides.draft ?? false,
        html_url: `https://github.com/vitalyiegorov/suuudokuuu/releases/tag/${tagName}`,
        name: `Development ${runNumber}`,
        prerelease: overrides.prerelease ?? true,
        published_at: PublishedAt,
        tag_name: tagName
    };
};

describe('selectBetaReleaseCandidates', () => {
    it('accepts real GitHub extra fields and returns sanitized candidates', () => {
        expect(selectBetaReleaseCandidates([createRelease(CurrentRunNumber)])).toEqual([
            {
                apkUrl: 'https://github.com/vitalyiegorov/suuudokuuu/releases/download/development-123/suuudokuuu-development.apk',
                branch: 'main',
                builtAt: '2026-07-14T10:20:30.000Z',
                checksumsUrl: 'https://github.com/vitalyiegorov/suuudokuuu/releases/download/development-123/SHA256SUMS',
                commitSha: CommitSha,
                ipaUrl: 'https://github.com/vitalyiegorov/suuudokuuu/releases/download/development-123/suuudokuuu-development.ipa',
                name: 'Development 123',
                publishedAt: PublishedAt,
                releaseNotes: 'Notes',
                runNumber: 123,
                tagName: 'development-123',
                version: '1.62.5',
                workflowUrl: 'https://github.com/vitalyiegorov/suuudokuuu/actions/runs/123'
            }
        ]);
    });

    it('sorts valid candidates by numeric tag descending', () => {
        const candidates = selectBetaReleaseCandidates([createRelease(9), createRelease(100), createRelease(10)]);

        expect(candidates.map(candidate => candidate.tagName)).toEqual(['development-100', 'development-10', 'development-9']);
    });

    it.each([
        createRelease(3, { draft: true }),
        createRelease(3, { prerelease: false }),
        createRelease(3, { tagName: 'development-latest' }),
        createRelease(3, { tagName: 'development-3-extra' }),
        createRelease(3, { body: null }),
        createRelease(3, { body: 'Notes without metadata' }),
        createRelease(3, { assets: createAssets('development-3').slice(0, 2) }),
        createRelease(3, { assets: [...createAssets('development-3'), createAsset('development-3', 'extra.txt')] }),
        createRelease(3, {
            assets: [
                createAsset('development-3', DevelopmentIpaAssetName),
                createAsset('development-3', DevelopmentIpaAssetName),
                createAsset('development-3', DevelopmentChecksumsAssetName)
            ]
        }),
        createRelease(3, {
            assets: [
                createAsset('development-3', DevelopmentIpaAssetName, 0),
                createAsset('development-3', DevelopmentApkAssetName),
                createAsset('development-3', DevelopmentChecksumsAssetName)
            ]
        }),
        createRelease(3, {
            assets: createAssets('development-3').map(asset => ({ ...asset, browser_download_url: `${asset.browser_download_url}?x=1` }))
        })
    ])('filters incomplete or ineligible releases', release => {
        expect(selectBetaReleaseCandidates([release])).toEqual([]);
    });

    it('falls back past an invalid newest structural release', () => {
        const candidates = selectBetaReleaseCandidates([
            createRelease(InvalidNewestRunNumber, { body: 'invalid' }),
            createRelease(OlderRunNumber)
        ]);

        expect(candidates.map(candidate => candidate.tagName)).toEqual(['development-199']);
    });

    it.each([{}, null, [{ tag_name: 'development-1' }], [{ ...createRelease(1), assets: 'invalid' }]])(
        'returns no candidates for malformed GitHub JSON',
        input => {
            expect(selectBetaReleaseCandidates(input)).toEqual([]);
            expect(parseBetaReleaseCandidates(input)).toEqual({ status: 'invalid' });
        }
    );

    it('distinguishes a valid empty GitHub response', () => {
        expect(parseBetaReleaseCandidates([])).toEqual({ candidates: [], status: 'valid' });
    });
});
