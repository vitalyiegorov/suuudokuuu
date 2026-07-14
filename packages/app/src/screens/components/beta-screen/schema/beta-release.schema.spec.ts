import { describe, expect, it } from '@jest/globals';

import { BetaReleaseSchema } from './beta-release.schema';

const ChecksumLength = 64;
const CommitShaSuffixLength = 33;

const ValidRelease = {
    branch: 'main',
    builtAt: '2026-07-14T12:00:00Z',
    checksums: {
        apk: 'b'.repeat(ChecksumLength),
        ipa: 'a'.repeat(ChecksumLength)
    },
    commitSha: `081761a${'0'.repeat(CommitShaSuffixLength)}`,
    commitShortSha: '081761a',
    installUrls: {
        android: '/api/beta/apk',
        iosManifest: '/ota/manifest.plist'
    },
    name: 'Development 241',
    publishedAt: '2026-07-14T12:30:00Z',
    releaseNotes: 'Development build metadata and notes.',
    runNumber: 241,
    tagName: 'development-241',
    version: '1.62.5',
    workflowUrl: 'https://github.com/vitalyiegorov/suuudokuuu/actions/runs/123456789'
};

describe('BetaReleaseSchema', () => {
    it('accepts the exact public release contract', () => {
        expect(BetaReleaseSchema.parse(ValidRelease)).toEqual(ValidRelease);
    });

    it.each([
        { ...ValidRelease, extra: true },
        { ...ValidRelease, commitSha: 'A'.repeat(40) },
        { ...ValidRelease, commitShortSha: '081761b' },
        { ...ValidRelease, version: 'v1.62.5' },
        { ...ValidRelease, builtAt: '2026-07-14T12:00:00+02:00' },
        { ...ValidRelease, publishedAt: '2026-02-30T12:00:00Z' },
        { ...ValidRelease, workflowUrl: 'https://github.com/other/repository/actions/runs/123456789' },
        { ...ValidRelease, checksums: { ...ValidRelease.checksums, ipa: 'A'.repeat(ChecksumLength) } },
        { ...ValidRelease, installUrls: { ...ValidRelease.installUrls, android: 'https://example.com/app.apk' } },
        { ...ValidRelease, installUrls: { ...ValidRelease.installUrls, iosManifest: '/other/manifest.plist' } }
    ])('rejects malformed or unexpected public data', release => {
        expect(BetaReleaseSchema.safeParse(release).success).toBe(false);
    });
});
