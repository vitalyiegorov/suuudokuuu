import { describe, expect, it } from '@jest/globals';

import { fetchBetaRelease } from './fetch-beta-release.util';

const ChecksumLength = 64;
const CommitShaSuffixLength = 33;
const HttpCreatedStatus = 201;
const HttpBadGatewayStatus = 502;

const ValidRelease = {
    branch: 'main',
    builtAt: '2026-07-14T12:00:00Z',
    checksums: { apk: 'b'.repeat(ChecksumLength), ipa: 'a'.repeat(ChecksumLength) },
    commitSha: `081761a${'0'.repeat(CommitShaSuffixLength)}`,
    commitShortSha: '081761a',
    installUrls: { android: '/api/beta/apk', iosManifest: '/ota/manifest.plist' },
    name: 'Development 241',
    publishedAt: '2026-07-14T12:30:00Z',
    releaseNotes: 'Development build metadata and notes.',
    runNumber: 241,
    tagName: 'development-241',
    version: '1.62.5',
    workflowUrl: 'https://github.com/vitalyiegorov/suuudokuuu/actions/runs/123456789'
};

const createFetch =
    (response: Response): typeof fetch =>
    async () =>
        response;

describe('fetchBetaRelease', () => {
    it('returns ready for a valid 200 response and sends a GET request', async () => {
        let requestUrl = '';
        let requestMethod = '';
        const request: typeof fetch = async (input, init) => {
            if (typeof input === 'string') {
                requestUrl = input;
            } else if (input instanceof URL) {
                requestUrl = input.href;
            } else {
                requestUrl = input.url;
            }
            requestMethod = init?.method ?? '';

            return new Response(JSON.stringify(ValidRelease), { status: 200 });
        };

        await expect(fetchBetaRelease(request)).resolves.toEqual({ release: ValidRelease, status: 'ready' });
        expect(requestUrl.endsWith('/api/beta/release')).toBe(true);
        expect(requestMethod).toBe('GET');
    });

    it('returns empty for a 404 response', async () => {
        await expect(fetchBetaRelease(createFetch(new Response(null, { status: 404 })))).resolves.toEqual({ status: 'empty' });
    });

    it.each([HttpBadGatewayStatus, HttpCreatedStatus])('returns error for status %s', async status => {
        await expect(fetchBetaRelease(createFetch(new Response('{}', { status })))).resolves.toEqual({ status: 'error' });
    });

    it('returns error for a network failure', async () => {
        const request: typeof fetch = async () => Promise.reject(new Error('private upstream detail'));

        await expect(fetchBetaRelease(request)).resolves.toEqual({ status: 'error' });
    });

    it('returns error for invalid JSON', async () => {
        await expect(fetchBetaRelease(createFetch(new Response('{', { status: 200 })))).resolves.toEqual({ status: 'error' });
    });

    it('returns error for schema-invalid JSON', async () => {
        await expect(
            fetchBetaRelease(createFetch(new Response(JSON.stringify({ ...ValidRelease, extra: true }), { status: 200 })))
        ).resolves.toEqual({
            status: 'error'
        });
    });
});
