import { IncomingMessage, ServerResponse } from 'node:http';
import { Socket } from 'node:net';

import { describe, expect, it, jest } from '@jest/globals';

import releaseRoute from '../api/beta/release.js';

import { HttpMethodNotAllowedStatus, HttpOkStatus } from './beta-release.constant.js';
import { createNodeHandler } from './create-node-handler.util.js';

import type { FetchEndpoint } from './fetch-endpoint.interface.js';

const RequestHost = 'example.com';
const RequestPath = '/api/beta/release';
const RequestBody = '{"unsupported":true}';

const createIncomingRequest = (method: string, body?: string) => {
    const incomingRequest = new IncomingMessage(new Socket());

    incomingRequest.method = method;
    incomingRequest.url = RequestPath;
    incomingRequest.headers.host = RequestHost;

    if (typeof body === 'string') {
        incomingRequest.push(Buffer.from(body));
    }
    incomingRequest.push(null);

    return incomingRequest;
};

const createServerResponse = (incomingRequest: IncomingMessage) => {
    const serverResponse = new ServerResponse(incomingRequest);
    const writtenChunks: Uint8Array[] = [];
    const writeHeadSpy = jest.spyOn(serverResponse, 'writeHead').mockReturnValue(serverResponse);
    const endSpy = jest.spyOn(serverResponse, 'end').mockReturnValue(serverResponse);

    jest.spyOn(serverResponse, 'write').mockImplementation(chunk => {
        if (chunk instanceof Uint8Array) {
            writtenChunks.push(chunk);
        }

        return true;
    });

    return { endSpy, serverResponse, writeHeadSpy, writtenChunks };
};

const decodeWrittenBody = (writtenChunks: Uint8Array[]) => {
    const textDecoder = new TextDecoder();

    return writtenChunks.map(writtenChunk => textDecoder.decode(writtenChunk)).join('');
};

describe('createNodeHandler', () => {
    it('rejects a POST with the method-not-allowed response of the bundled endpoint', async () => {
        const incomingRequest = createIncomingRequest('POST', RequestBody);
        const { endSpy, serverResponse, writeHeadSpy, writtenChunks } = createServerResponse(incomingRequest);

        await createNodeHandler(releaseRoute)(incomingRequest, serverResponse);

        expect(writeHeadSpy).toHaveBeenCalledWith(
            HttpMethodNotAllowedStatus,
            expect.objectContaining({ allow: 'GET, HEAD', 'content-type': 'application/json; charset=utf-8' })
        );
        expect(endSpy).toHaveBeenCalledTimes(1);
        expect(JSON.parse(decodeWrittenBody(writtenChunks))).toEqual({ error: 'Method not allowed' });
    });

    it('forwards a GET with its URL and headers and writes the response body back', async () => {
        const incomingRequest = createIncomingRequest('GET');
        const { endSpy, serverResponse, writeHeadSpy, writtenChunks } = createServerResponse(incomingRequest);
        const forwardedRequests: Request[] = [];
        const endpoint: FetchEndpoint = {
            fetch: async request => {
                forwardedRequests.push(request);

                return new Response('streamed-body', { headers: { 'Content-Type': 'text/plain' }, status: HttpOkStatus });
            }
        };

        await createNodeHandler(endpoint)(incomingRequest, serverResponse);

        expect(forwardedRequests).toHaveLength(1);
        expect(forwardedRequests[0]?.method).toBe('GET');
        expect(forwardedRequests[0]?.url).toBe(`https://${RequestHost}${RequestPath}`);
        expect(forwardedRequests[0]?.headers.get('host')).toBe(RequestHost);
        expect(writeHeadSpy).toHaveBeenCalledWith(HttpOkStatus, expect.objectContaining({ 'content-type': 'text/plain' }));
        expect(endSpy).toHaveBeenCalledTimes(1);
        expect(decodeWrittenBody(writtenChunks)).toBe('streamed-body');
    });

    it('forwards the request body for methods that are allowed to carry one', async () => {
        const incomingRequest = createIncomingRequest('PUT', RequestBody);
        const { serverResponse } = createServerResponse(incomingRequest);
        const forwardedBodies: string[] = [];
        const endpoint: FetchEndpoint = {
            fetch: async request => {
                forwardedBodies.push(await request.text());

                return new Response(null, { status: HttpOkStatus });
            }
        };

        await createNodeHandler(endpoint)(incomingRequest, serverResponse);

        expect(forwardedBodies).toEqual([RequestBody]);
    });

    it('falls back to a local origin and the root path when the host header and url are missing', async () => {
        const incomingRequest = new IncomingMessage(new Socket());
        incomingRequest.push(null);
        const { endSpy, serverResponse } = createServerResponse(incomingRequest);
        const forwardedRequests: Request[] = [];
        const endpoint: FetchEndpoint = {
            fetch: async request => {
                forwardedRequests.push(request);

                return new Response(null, { status: HttpOkStatus });
            }
        };

        await createNodeHandler(endpoint)(incomingRequest, serverResponse);

        expect(forwardedRequests[0]?.url).toBe('https://localhost/');
        expect(forwardedRequests[0]?.method).toBe('GET');
        expect(endSpy).toHaveBeenCalledTimes(1);
    });

    it('appends repeated incoming headers instead of dropping them', async () => {
        const incomingRequest = createIncomingRequest('GET');
        incomingRequest.headers['x-forwarded-for'] = ['203.0.113.1', '203.0.113.2'];
        const { serverResponse } = createServerResponse(incomingRequest);
        const forwardedRequests: Request[] = [];
        const endpoint: FetchEndpoint = {
            fetch: async request => {
                forwardedRequests.push(request);

                return new Response(null, { status: HttpOkStatus });
            }
        };

        await createNodeHandler(endpoint)(incomingRequest, serverResponse);

        expect(forwardedRequests[0]?.headers.get('x-forwarded-for')).toBe('203.0.113.1, 203.0.113.2');
    });
});
