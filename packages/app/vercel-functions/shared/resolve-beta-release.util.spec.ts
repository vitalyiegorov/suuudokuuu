import { describe, expect, it, jest } from '@jest/globals';

import {
    DevelopmentApkAssetName,
    DevelopmentChecksumsAssetName,
    DevelopmentIpaAssetName,
    DevelopmentReleaseApiUrl,
    MaximumChecksumsByteLength
} from './beta-release.constant';
import { resolveBetaRelease } from './resolve-beta-release.util';

const ChecksumLength = 64;
const IpaChecksum = 'a'.repeat(ChecksumLength);
const ApkChecksum = 'b'.repeat(ChecksumLength);
const ValidChecksums = `${IpaChecksum}  suuudokuuu-development.ipa\n${ApkChecksum}  suuudokuuu-development.apk\n`;
const CommitSha = '0123456789abcdef0123456789abcdef01234567';
const SuccessStatus = 200;
const CurrentRunNumber = 123;
const PreviousRunNumber = 122;

const createAsset = (runNumber: number, name: string) => ({
    browser_download_url: `https://github.com/vitalyiegorov/suuudokuuu/releases/download/development-${runNumber}/${name}`,
    id: runNumber,
    name,
    size: 100
});

const createRelease = (runNumber: number) => {
    const metadata = {
        branch: 'main',
        builtAt: '2026-07-14T10:20:30.000Z',
        commitSha: CommitSha,
        version: '1.62.5',
        workflowUrl: `https://github.com/vitalyiegorov/suuudokuuu/actions/runs/${runNumber + 1000}`
    };

    return {
        assets: [
            createAsset(runNumber, DevelopmentIpaAssetName),
            createAsset(runNumber, DevelopmentApkAssetName),
            createAsset(runNumber, DevelopmentChecksumsAssetName)
        ],
        author: { login: 'not-exposed' },
        body: `<!-- suuudokuuu-development-metadata ${JSON.stringify(metadata)} -->\n\nRelease ${runNumber} notes`,
        draft: false,
        name: `Development ${runNumber}`,
        prerelease: true,
        published_at: '2026-07-14T10:30:00Z',
        tag_name: `development-${runNumber}`,
        url: `https://api.github.com/releases/${runNumber}`
    };
};

const createJsonResponse = (input: unknown, status = SuccessStatus) =>
    new Response(JSON.stringify(input), { headers: { 'Content-Type': 'application/json' }, status });

describe('resolveBetaRelease', () => {
    it('returns a sanitized ready release and sends the authenticated GitHub request', async () => {
        const fetchMock = jest.fn<typeof fetch>();
        fetchMock.mockResolvedValueOnce(createJsonResponse([createRelease(CurrentRunNumber)]));
        fetchMock.mockResolvedValueOnce(new Response(ValidChecksums));

        const result = await resolveBetaRelease({ fetch: fetchMock, githubToken: 'secret-token' });

        expect(fetchMock).toHaveBeenNthCalledWith(1, DevelopmentReleaseApiUrl, {
            headers: {
                Accept: 'application/vnd.github+json',
                Authorization: 'Bearer secret-token',
                'User-Agent': 'suuudokuuu-development-release-resolver',
                'X-GitHub-Api-Version': '2022-11-28'
            },
            method: 'GET'
        });
        expect(fetchMock).toHaveBeenNthCalledWith(
            2,
            'https://github.com/vitalyiegorov/suuudokuuu/releases/download/development-123/SHA256SUMS'
        );
        expect(result).toEqual({
            release: {
                apkUrl: 'https://github.com/vitalyiegorov/suuudokuuu/releases/download/development-123/suuudokuuu-development.apk',
                branch: 'main',
                builtAt: '2026-07-14T10:20:30.000Z',
                checksums: { apk: ApkChecksum, ipa: IpaChecksum },
                commitSha: CommitSha,
                ipaUrl: 'https://github.com/vitalyiegorov/suuudokuuu/releases/download/development-123/suuudokuuu-development.ipa',
                name: 'Development 123',
                publishedAt: '2026-07-14T10:30:00Z',
                releaseNotes: 'Release 123 notes',
                runNumber: 123,
                tagName: 'development-123',
                version: '1.62.5',
                workflowUrl: 'https://github.com/vitalyiegorov/suuudokuuu/actions/runs/1123'
            },
            status: 'ready'
        });
    });

    it('omits authorization when no GitHub token is defined', async () => {
        const fetchMock = jest.fn<typeof fetch>();
        fetchMock.mockResolvedValueOnce(createJsonResponse([]));

        await resolveBetaRelease({ fetch: fetchMock });

        expect(fetchMock).toHaveBeenCalledWith(DevelopmentReleaseApiUrl, {
            headers: {
                Accept: 'application/vnd.github+json',
                'User-Agent': 'suuudokuuu-development-release-resolver',
                'X-GitHub-Api-Version': '2022-11-28'
            },
            method: 'GET'
        });
    });

    it.each([
        { releases: [] },
        {
            releases: [
                {
                    ...createRelease(CurrentRunNumber),
                    draft: true
                }
            ]
        }
    ])('returns not-found when a valid response has no complete candidate', async ({ releases }) => {
        const fetchMock = jest.fn<typeof fetch>();
        fetchMock.mockResolvedValueOnce(createJsonResponse(releases));

        await expect(resolveBetaRelease({ fetch: fetchMock })).resolves.toEqual({ status: 'not-found' });
    });

    it('falls back to the next structural candidate after a bad newest checksum', async () => {
        const fetchMock = jest.fn<typeof fetch>();
        fetchMock.mockResolvedValueOnce(createJsonResponse([createRelease(PreviousRunNumber), createRelease(CurrentRunNumber)]));
        fetchMock.mockResolvedValueOnce(new Response('invalid'));
        fetchMock.mockResolvedValueOnce(new Response(ValidChecksums));

        const result = await resolveBetaRelease({ fetch: fetchMock });

        expect(result).toMatchObject({ release: { tagName: 'development-122' }, status: 'ready' });
    });

    it('falls back past a malformed newest release', async () => {
        const fetchMock = jest.fn<typeof fetch>();
        fetchMock.mockResolvedValueOnce(createJsonResponse([{ tag_name: 'development-200' }, createRelease(PreviousRunNumber)]));
        fetchMock.mockResolvedValueOnce(new Response(ValidChecksums));

        const result = await resolveBetaRelease({ fetch: fetchMock });

        expect(result).toMatchObject({ release: { tagName: 'development-122' }, status: 'ready' });
    });

    it('returns not-found when every array item is malformed', async () => {
        const fetchMock = jest.fn<typeof fetch>();
        fetchMock.mockResolvedValueOnce(createJsonResponse([{ tag_name: 'development-200' }]));

        await expect(resolveBetaRelease({ fetch: fetchMock })).resolves.toEqual({ status: 'not-found' });
    });

    it.each([
        new Response('not found', { status: 404 }),
        new Response('invalid checksums'),
        new Response(`${ValidChecksums}${'x'.repeat(MaximumChecksumsByteLength)}`)
    ])('returns upstream-failure when every candidate checksum response fails', async checksumResponse => {
        const fetchMock = jest.fn<typeof fetch>();
        fetchMock.mockResolvedValueOnce(createJsonResponse([createRelease(CurrentRunNumber)]));
        fetchMock.mockResolvedValueOnce(checksumResponse);

        await expect(resolveBetaRelease({ fetch: fetchMock })).resolves.toEqual({ status: 'upstream-failure' });
    });

    it('continues after a checksum network failure before returning upstream-failure', async () => {
        const fetchMock = jest.fn<typeof fetch>();
        fetchMock.mockResolvedValueOnce(createJsonResponse([createRelease(CurrentRunNumber)]));
        fetchMock.mockRejectedValueOnce(new Error('checksum network failure'));

        await expect(resolveBetaRelease({ fetch: fetchMock })).resolves.toEqual({ status: 'upstream-failure' });
    });

    it('returns upstream-failure when the checksum response body cannot be read', async () => {
        const fetchMock = jest.fn<typeof fetch>();
        const checksumResponse = new Response(ValidChecksums);
        jest.spyOn(checksumResponse, 'text').mockRejectedValue(new Error('body read failure'));
        fetchMock.mockResolvedValueOnce(createJsonResponse([createRelease(CurrentRunNumber)]));
        fetchMock.mockResolvedValueOnce(checksumResponse);

        await expect(resolveBetaRelease({ fetch: fetchMock })).resolves.toEqual({ status: 'upstream-failure' });
    });

    it('falls back after a checksum response body cannot be read', async () => {
        const fetchMock = jest.fn<typeof fetch>();
        const checksumResponse = new Response(ValidChecksums);
        jest.spyOn(checksumResponse, 'text').mockRejectedValue(new Error('body read failure'));
        fetchMock.mockResolvedValueOnce(createJsonResponse([createRelease(CurrentRunNumber), createRelease(PreviousRunNumber)]));
        fetchMock.mockResolvedValueOnce(checksumResponse);
        fetchMock.mockResolvedValueOnce(new Response(ValidChecksums));

        const result = await resolveBetaRelease({ fetch: fetchMock });

        expect(result).toMatchObject({ release: { tagName: 'development-122' }, status: 'ready' });
    });

    it('returns upstream-failure for a GitHub network failure', async () => {
        const fetchMock = jest.fn<typeof fetch>();
        fetchMock.mockRejectedValueOnce(new Error('network failure'));

        await expect(resolveBetaRelease({ fetch: fetchMock })).resolves.toEqual({ status: 'upstream-failure' });
    });

    it('returns upstream-failure for a non-successful GitHub response', async () => {
        const fetchMock = jest.fn<typeof fetch>();
        fetchMock.mockResolvedValueOnce(createJsonResponse({}, 500));

        await expect(resolveBetaRelease({ fetch: fetchMock })).resolves.toEqual({ status: 'upstream-failure' });
    });

    it('returns upstream-failure for invalid GitHub JSON', async () => {
        const fetchMock = jest.fn<typeof fetch>();
        fetchMock.mockResolvedValueOnce(new Response('{', { status: SuccessStatus }));

        await expect(resolveBetaRelease({ fetch: fetchMock })).resolves.toEqual({ status: 'upstream-failure' });
    });

    it('returns upstream-failure for an invalid GitHub response shape', async () => {
        const fetchMock = jest.fn<typeof fetch>();
        fetchMock.mockResolvedValueOnce(createJsonResponse({ releases: [] }));

        await expect(resolveBetaRelease({ fetch: fetchMock })).resolves.toEqual({ status: 'upstream-failure' });
    });
});
