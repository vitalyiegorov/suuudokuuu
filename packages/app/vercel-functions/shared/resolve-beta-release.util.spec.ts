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
const MaximumReleasesByteLength = 4_194_304;
const MaximumChecksumAttempts = 5;

const createTagName = (runNumber: number) => `development-${runNumber}-1-1`;

const createAsset = (runNumber: number, name: string) => ({
    browser_download_url: `https://github.com/vitalyiegorov/suuudokuuu/releases/download/${createTagName(runNumber)}/${name}`,
    id: runNumber,
    name,
    size: 100
});

const createRelease = (runNumber: number, bundleVersion: string | null = `${runNumber}.1`) => {
    const metadata = {
        branch: 'main',
        ...(bundleVersion !== null && { bundleVersion }),
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
        tag_name: createTagName(runNumber),
        url: `https://api.github.com/releases/${runNumber}`
    };
};

const createJsonResponse = (input: unknown, status = SuccessStatus) =>
    new Response(JSON.stringify(input), { headers: { 'Content-Type': 'application/json' }, status });

const createBodyReadFailureResponse = () => {
    const response = new Response(ValidChecksums);
    if (response.body === null) {
        throw new Error('Expected checksum response body');
    }

    const reader = response.body.getReader();
    jest.spyOn(reader, 'read').mockRejectedValue(new Error('body read failure'));
    jest.spyOn(response.body, 'getReader').mockReturnValue(reader);

    return response;
};

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
            method: 'GET',
            signal: expect.any(AbortSignal)
        });
        expect(fetchMock).toHaveBeenNthCalledWith(
            2,
            'https://github.com/vitalyiegorov/suuudokuuu/releases/download/development-123-1-1/SHA256SUMS',
            { signal: expect.any(AbortSignal) }
        );
        expect(result).toEqual({
            release: {
                apkUrl: 'https://github.com/vitalyiegorov/suuudokuuu/releases/download/development-123-1-1/suuudokuuu-development.apk',
                branch: 'main',
                bundleVersion: '123.1',
                builtAt: '2026-07-14T10:20:30.000Z',
                checksums: { apk: ApkChecksum, ipa: IpaChecksum },
                commitSha: CommitSha,
                ipaUrl: 'https://github.com/vitalyiegorov/suuudokuuu/releases/download/development-123-1-1/suuudokuuu-development.ipa',
                name: 'Development 123',
                publishedAt: '2026-07-14T10:30:00Z',
                releaseNotes: 'Release 123 notes',
                runNumber: 123,
                tagName: 'development-123-1-1',
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
            method: 'GET',
            signal: expect.any(AbortSignal)
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

        expect(result).toMatchObject({ release: { tagName: 'development-122-1-1' }, status: 'ready' });
    });

    it('uses one request-wide abort signal across release and checksum fetches', async () => {
        const fetchMock = jest.fn<typeof fetch>();
        fetchMock.mockResolvedValueOnce(createJsonResponse([createRelease(CurrentRunNumber), createRelease(PreviousRunNumber)]));
        fetchMock.mockResolvedValueOnce(new Response('invalid'));
        fetchMock.mockResolvedValueOnce(new Response(ValidChecksums));

        await resolveBetaRelease({ fetch: fetchMock });

        const releasesSignal = fetchMock.mock.calls.at(0)?.[1]?.signal ?? null;
        const firstChecksumSignal = fetchMock.mock.calls.at(1)?.[1]?.signal ?? null;
        const secondChecksumSignal = fetchMock.mock.calls.at(2)?.[1]?.signal ?? null;
        expect(releasesSignal).toBeInstanceOf(AbortSignal);
        expect(firstChecksumSignal === releasesSignal).toBe(true);
        expect(secondChecksumSignal === releasesSignal).toBe(true);
    });

    it('limits checksum fallback to five newest structural candidates', async () => {
        const fetchMock = jest.fn<typeof fetch>();
        const releases = Array.from({ length: 7 }, (_value, index) => createRelease(100 - index));
        fetchMock.mockResolvedValueOnce(createJsonResponse(releases));
        for (let attempt = 0; attempt < MaximumChecksumAttempts; attempt += 1) {
            fetchMock.mockResolvedValueOnce(new Response('invalid'));
        }

        await expect(resolveBetaRelease({ fetch: fetchMock })).resolves.toEqual({ status: 'upstream-failure' });
        expect(fetchMock).toHaveBeenCalledTimes(MaximumChecksumAttempts + 1);
    });

    it('falls back past a malformed newest release', async () => {
        const fetchMock = jest.fn<typeof fetch>();
        fetchMock.mockResolvedValueOnce(createJsonResponse([{ tag_name: 'development-200-1-1' }, createRelease(PreviousRunNumber)]));
        fetchMock.mockResolvedValueOnce(new Response(ValidChecksums));

        const result = await resolveBetaRelease({ fetch: fetchMock });

        expect(result).toMatchObject({ release: { tagName: 'development-122-1-1' }, status: 'ready' });
    });

    it('falls back past a newest release without bundle-version metadata', async () => {
        const fetchMock = jest.fn<typeof fetch>();
        fetchMock.mockResolvedValueOnce(createJsonResponse([createRelease(CurrentRunNumber, null), createRelease(PreviousRunNumber)]));
        fetchMock.mockResolvedValueOnce(new Response(ValidChecksums));

        const result = await resolveBetaRelease({ fetch: fetchMock });

        expect(result).toMatchObject({ release: { bundleVersion: '122.1', tagName: 'development-122-1-1' }, status: 'ready' });
    });

    it('returns not-found when every array item is malformed', async () => {
        const fetchMock = jest.fn<typeof fetch>();
        fetchMock.mockResolvedValueOnce(createJsonResponse([{ tag_name: 'development-200-1-1' }]));

        await expect(resolveBetaRelease({ fetch: fetchMock })).resolves.toEqual({ status: 'not-found' });
    });

    it('rejects an oversized advertised checksum asset before fetching it', async () => {
        const fetchMock = jest.fn<typeof fetch>();
        const release = createRelease(CurrentRunNumber);
        const oversizedRelease = {
            ...release,
            assets: release.assets.map(asset =>
                asset.name === DevelopmentChecksumsAssetName ? { ...asset, size: MaximumChecksumsByteLength + 1 } : asset
            )
        };
        fetchMock.mockResolvedValueOnce(createJsonResponse([oversizedRelease]));

        await expect(resolveBetaRelease({ fetch: fetchMock })).resolves.toEqual({ status: 'not-found' });
        expect(fetchMock).toHaveBeenCalledTimes(1);
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
        fetchMock.mockResolvedValueOnce(createJsonResponse([createRelease(CurrentRunNumber)]));
        fetchMock.mockResolvedValueOnce(createBodyReadFailureResponse());

        await expect(resolveBetaRelease({ fetch: fetchMock })).resolves.toEqual({ status: 'upstream-failure' });
    });

    it('falls back after a checksum response body cannot be read', async () => {
        const fetchMock = jest.fn<typeof fetch>();
        fetchMock.mockResolvedValueOnce(createJsonResponse([createRelease(CurrentRunNumber), createRelease(PreviousRunNumber)]));
        fetchMock.mockResolvedValueOnce(createBodyReadFailureResponse());
        fetchMock.mockResolvedValueOnce(new Response(ValidChecksums));

        const result = await resolveBetaRelease({ fetch: fetchMock });

        expect(result).toMatchObject({ release: { tagName: 'development-122-1-1' }, status: 'ready' });
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

    it('returns upstream-failure for a non-successful GitHub response without a body', async () => {
        const fetchMock = jest.fn<typeof fetch>();
        fetchMock.mockResolvedValueOnce(new Response(null, { status: 500 }));

        await expect(resolveBetaRelease({ fetch: fetchMock })).resolves.toEqual({ status: 'upstream-failure' });
    });

    it('cancels a non-successful GitHub response body', async () => {
        const cancel = jest.fn<() => void>();
        const fetchMock = jest.fn<typeof fetch>();
        const response = new Response('failure', { status: 500 });
        if (response.body === null) {
            throw new Error('Expected GitHub response body');
        }
        jest.spyOn(response.body, 'cancel').mockImplementation(async () => void cancel());
        fetchMock.mockResolvedValueOnce(response);

        await expect(resolveBetaRelease({ fetch: fetchMock })).resolves.toEqual({ status: 'upstream-failure' });
        expect(cancel).toHaveBeenCalledTimes(1);
    });

    it('cancels a non-successful checksum response body', async () => {
        const cancel = jest.fn<() => void>();
        const fetchMock = jest.fn<typeof fetch>();
        const response = new Response('failure', { status: 500 });
        if (response.body === null) {
            throw new Error('Expected checksum response body');
        }
        jest.spyOn(response.body, 'cancel').mockImplementation(async () => void cancel());
        fetchMock.mockResolvedValueOnce(createJsonResponse([createRelease(CurrentRunNumber)]));
        fetchMock.mockResolvedValueOnce(response);

        await expect(resolveBetaRelease({ fetch: fetchMock })).resolves.toEqual({ status: 'upstream-failure' });
        expect(cancel).toHaveBeenCalledTimes(1);
    });

    it('maps a response cancellation failure to upstream-failure', async () => {
        const fetchMock = jest.fn<typeof fetch>();
        const response = new Response('failure', { status: 500 });
        if (response.body === null) {
            throw new Error('Expected GitHub response body');
        }
        jest.spyOn(response.body, 'cancel').mockRejectedValue(new Error('cancel failure'));
        fetchMock.mockResolvedValueOnce(response);

        await expect(resolveBetaRelease({ fetch: fetchMock })).resolves.toEqual({ status: 'upstream-failure' });
    });

    it('returns upstream-failure for invalid GitHub JSON', async () => {
        const fetchMock = jest.fn<typeof fetch>();
        const response = new Response('{', { status: SuccessStatus });
        if (response.body === null) {
            throw new Error('Expected GitHub response body');
        }

        const getReader = jest.spyOn(response.body, 'getReader');
        fetchMock.mockResolvedValueOnce(response);

        await expect(resolveBetaRelease({ fetch: fetchMock })).resolves.toEqual({ status: 'upstream-failure' });
        expect(getReader).toHaveBeenCalledTimes(1);
    });

    it('cancels an oversized chunked GitHub releases body immediately', async () => {
        const fetchMock = jest.fn<typeof fetch>();
        const response = new Response('placeholder');
        if (response.body === null) {
            throw new Error('Expected GitHub response body');
        }

        const reader = response.body.getReader();
        const cancel = jest.spyOn(reader, 'cancel').mockResolvedValue();
        jest.spyOn(reader, 'read')
            .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode('x'.repeat(MaximumReleasesByteLength)) })
            .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode('x') });
        jest.spyOn(response.body, 'getReader').mockReturnValue(reader);
        fetchMock.mockResolvedValueOnce(response);

        await expect(resolveBetaRelease({ fetch: fetchMock })).resolves.toEqual({ status: 'upstream-failure' });
        expect(cancel).toHaveBeenCalledTimes(1);
        expect(response.headers.has('Content-Length')).toBe(false);
    });

    it('returns upstream-failure for an invalid GitHub response shape', async () => {
        const fetchMock = jest.fn<typeof fetch>();
        fetchMock.mockResolvedValueOnce(createJsonResponse({ releases: [] }));

        await expect(resolveBetaRelease({ fetch: fetchMock })).resolves.toEqual({ status: 'upstream-failure' });
    });
});
