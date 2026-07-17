import { describe, expect, it, jest } from '@jest/globals';

import apkRoute from '../api/beta/apk';
import ipaRoute from '../api/beta/ipa';
import manifestRoute from '../api/beta/manifest';
import releaseRoute from '../api/beta/release';

import {
    GithubReleasesTokenEnvironmentVariable,
    HttpBadGatewayStatus,
    HttpFoundStatus,
    HttpMethodNotAllowedStatus,
    HttpNotFoundStatus,
    HttpOkStatus
} from './beta-release.constant';
import { createBetaHandler, resolveBetaReleaseFromEnvironment } from './create-beta-handler.util';

import type { BetaRelease, ResolveBetaReleaseResult } from './beta-release.interface';

const CommitSha = '0123456789abcdef0123456789abcdef01234567';
const ChecksumLength = 64;
const IpaUrl = 'https://github.com/vitalyiegorov/suuudokuuu/releases/download/development-123-1-1/suuudokuuu-development.ipa';
const ApkUrl = 'https://github.com/vitalyiegorov/suuudokuuu/releases/download/development-123-1-1/suuudokuuu-development.apk';
const IpaChecksum = 'a'.repeat(ChecksumLength);
const ApkChecksum = 'b'.repeat(ChecksumLength);
const ReadyRelease: BetaRelease = {
    apkUrl: ApkUrl,
    branch: 'main',
    bundleVersion: '123.1',
    builtAt: '2026-07-14T10:20:30.000Z',
    checksums: { apk: ApkChecksum, ipa: IpaChecksum },
    commitSha: CommitSha,
    ipaUrl: IpaUrl,
    name: 'Development 123',
    publishedAt: '2026-07-14T10:30:00Z',
    releaseNotes: 'Release 123 notes',
    runNumber: 123,
    tagName: 'development-123-1-1',
    version: '1.62.5',
    workflowUrl: 'https://github.com/vitalyiegorov/suuudokuuu/actions/runs/1123'
};
const ReadyResult: ResolveBetaReleaseResult = { release: ReadyRelease, status: 'ready' };
const EndpointKinds = ['release', 'ipa', 'apk', 'manifest'] as const;
const SuccessCacheHeaders = {
    'Cache-Control': 'no-cache',
    'Vercel-CDN-Cache-Control': 'max-age=60, stale-while-revalidate=300',
    'X-Content-Type-Options': 'nosniff'
};
const ErrorCacheHeaders = {
    'Cache-Control': 'no-store',
    'Vercel-CDN-Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
};
const ManifestCacheHeaders = ErrorCacheHeaders;
const ExpectedManifest = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>items</key>
    <array>
        <dict>
            <key>assets</key>
            <array>
                <dict>
                    <key>kind</key>
                    <string>software-package</string>
                    <key>url</key>
                    <string>${IpaUrl}</string>
                </dict>
            </array>
            <key>metadata</key>
            <dict>
                <key>bundle-identifier</key>
                <string>com.vitalyiegorov.suuudokuuu.dev</string>
                <key>bundle-version</key>
                <string>123.1</string>
                <key>kind</key>
                <string>software</string>
                <key>title</key>
                <string>suuudokuuu (Dev)</string>
            </dict>
        </dict>
    </array>
</dict>
</plist>`;

const createResolver = (result: ResolveBetaReleaseResult) => jest.fn(async () => result);

const expectHeaders = (response: Response, expectedHeaders: Readonly<Record<string, string>>) => {
    for (const [name, value] of Object.entries(expectedHeaders)) {
        expect(response.headers.get(name)).toBe(value);
    }
};

describe('createBetaHandler', () => {
    it('returns only the public release fields', async () => {
        const handler = createBetaHandler('release', createResolver(ReadyResult));

        const response = await handler(new Request('https://example.com/api/beta/release'));

        expect(response.status).toBe(HttpOkStatus);
        expect(response.headers.get('Content-Type')).toBe('application/json; charset=utf-8');
        expectHeaders(response, SuccessCacheHeaders);
        await expect(response.json()).resolves.toEqual({
            branch: 'main',
            builtAt: '2026-07-14T10:20:30.000Z',
            checksums: { apk: ApkChecksum, ipa: IpaChecksum },
            commitSha: CommitSha,
            commitShortSha: '0123456',
            installUrls: { android: '/api/beta/apk', iosManifest: '/ota/manifest.plist' },
            name: 'Development 123',
            publishedAt: '2026-07-14T10:30:00Z',
            releaseNotes: 'Release 123 notes',
            runNumber: 123,
            tagName: 'development-123-1-1',
            version: '1.62.5',
            workflowUrl: 'https://github.com/vitalyiegorov/suuudokuuu/actions/runs/1123'
        });
    });

    it.each([
        { destination: IpaUrl, endpointKind: 'ipa' },
        { destination: ApkUrl, endpointKind: 'apk' }
    ] as const)('redirects the $endpointKind endpoint to its validated release asset', async ({ destination, endpointKind }) => {
        const handler = createBetaHandler(endpointKind, createResolver(ReadyResult));
        const request = new Request(`https://example.com/api/beta/${endpointKind}?destination=https://attacker.example/file`);

        const response = await handler(request);

        expect(response.status).toBe(HttpFoundStatus);
        expect(response.headers.get('Location')).toBe(destination);
        expectHeaders(response, SuccessCacheHeaders);
        await expect(response.text()).resolves.toBe('');
    });

    it('returns an atomic OTA manifest with the resolved bundle version and immutable IPA URL', async () => {
        const resolver = createResolver(ReadyResult);
        const handler = createBetaHandler('manifest', resolver);
        const request = new Request(
            'https://example.com/ota/manifest.plist?bundleVersion=999.9&ipaUrl=https%3A%2F%2Fattacker.example%2Fmalicious.ipa'
        );

        const response = await handler(request);
        const responseBody = await response.text();

        expect(response.status).toBe(HttpOkStatus);
        expect(response.headers.get('Content-Type')).toBe('application/xml; charset=utf-8');
        expectHeaders(response, ManifestCacheHeaders);
        expect(responseBody).toBe(ExpectedManifest);
        expect(responseBody).toContain(IpaUrl);
        expect(responseBody).not.toContain('/api/beta/ipa');
        expect(responseBody).not.toContain('attacker.example');
        expect(responseBody).not.toContain('999.9');
        expect(resolver).toHaveBeenCalledTimes(1);
    });

    it('escapes XML-sensitive resolved values in the OTA manifest', async () => {
        const ipaUrlWithXmlCharacters = `${IpaUrl}?first=1&second=<value>`;
        const release = { ...ReadyRelease, ipaUrl: ipaUrlWithXmlCharacters };
        const handler = createBetaHandler('manifest', createResolver({ release, status: 'ready' }));

        const response = await handler(new Request('https://example.com/ota/manifest.plist'));

        await expect(response.text()).resolves.toContain(`${IpaUrl}?first=1&amp;second=&lt;value&gt;`);
    });

    it.each(EndpointKinds)('returns a hardened not-found response from the %s endpoint', async endpointKind => {
        const handler = createBetaHandler(endpointKind, createResolver({ status: 'not-found' }));

        const response = await handler(new Request(`https://example.com/api/beta/${endpointKind}`));

        expect(response.status).toBe(HttpNotFoundStatus);
        expect(response.headers.get('Content-Type')).toBe('application/json; charset=utf-8');
        expectHeaders(response, ErrorCacheHeaders);
        await expect(response.json()).resolves.toEqual({ error: 'No development build is available' });
    });

    it.each(EndpointKinds)('returns a hardened upstream-failure response from the %s endpoint', async endpointKind => {
        const handler = createBetaHandler(endpointKind, createResolver({ status: 'upstream-failure' }));

        const response = await handler(new Request(`https://example.com/api/beta/${endpointKind}`));

        expect(response.status).toBe(HttpBadGatewayStatus);
        expect(response.headers.get('Content-Type')).toBe('application/json; charset=utf-8');
        expectHeaders(response, ErrorCacheHeaders);
        await expect(response.json()).resolves.toEqual({ error: 'Development build service is unavailable' });
    });

    it.each(EndpointKinds)('mirrors GET status and headers with an empty HEAD body for the %s endpoint', async endpointKind => {
        const handler = createBetaHandler(endpointKind, createResolver(ReadyResult));
        const url = `https://example.com/api/beta/${endpointKind}`;

        const getResponse = await handler(new Request(url));
        const headResponse = await handler(new Request(url, { method: 'HEAD' }));

        expect(headResponse.status).toBe(getResponse.status);
        expect([...headResponse.headers]).toEqual([...getResponse.headers]);
        await expect(headResponse.text()).resolves.toBe('');
    });

    it.each([{ result: { status: 'not-found' } }, { result: { status: 'upstream-failure' } }] as const)(
        'keeps HEAD error responses bodyless for $result.status',
        async ({ result }) => {
            for (const endpointKind of EndpointKinds) {
                const handler = createBetaHandler(endpointKind, createResolver(result));
                const response = await handler(new Request(`https://example.com/api/beta/${endpointKind}`, { method: 'HEAD' }));

                const expectedStatus = result.status === 'not-found' ? HttpNotFoundStatus : HttpBadGatewayStatus;
                expect(response.status).toBe(expectedStatus);
                expect(response.headers.get('Content-Type')).toBe('application/json; charset=utf-8');
                expectHeaders(response, ErrorCacheHeaders);
                await expect(response.text()).resolves.toBe('');
            }
        }
    );

    it.each(['POST', 'PUT', 'DELETE'])('rejects %s without resolving a release', async method => {
        for (const endpointKind of EndpointKinds) {
            const resolver = createResolver(ReadyResult);
            const handler = createBetaHandler(endpointKind, resolver);

            const response = await handler(new Request(`https://example.com/api/beta/${endpointKind}`, { method }));

            expect(response.status).toBe(HttpMethodNotAllowedStatus);
            expect(response.headers.get('Allow')).toBe('GET, HEAD');
            expect(response.headers.get('Content-Type')).toBe('application/json; charset=utf-8');
            expectHeaders(response, ErrorCacheHeaders);
            await expect(response.json()).resolves.toEqual({ error: 'Method not allowed' });
            expect(resolver).not.toHaveBeenCalled();
        }
    });
});

describe('Vercel route adapters', () => {
    it.each([
        { route: releaseRoute, routeName: 'release' },
        { route: ipaRoute, routeName: 'ipa' },
        { route: apkRoute, routeName: 'apk' },
        { route: manifestRoute, routeName: 'manifest' }
    ])('exports $routeName with a Web Fetch adapter object', ({ route }) => {
        expect(typeof route.fetch).toBe('function');
    });
});

describe('resolveBetaReleaseFromEnvironment', () => {
    it('passes the optional GitHub releases token without exposing it in the result', async () => {
        const fetchMock = jest
            .spyOn(globalThis, 'fetch')
            .mockResolvedValue(new Response('[]', { headers: { 'Content-Type': 'application/json' } }));
        const environmentReplacement = jest.replaceProperty(process, 'env', {
            ...process.env,
            [GithubReleasesTokenEnvironmentVariable]: 'environment-secret'
        });

        try {
            await expect(resolveBetaReleaseFromEnvironment()).resolves.toEqual({ status: 'not-found' });
            expect(fetchMock).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer environment-secret' }) })
            );
        } finally {
            fetchMock.mockRestore();
            environmentReplacement.restore();
        }
    });
});
