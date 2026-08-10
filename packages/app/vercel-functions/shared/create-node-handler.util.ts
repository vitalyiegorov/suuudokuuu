import { buffer } from 'node:stream/consumers';

import type { FetchEndpoint } from './fetch-endpoint.interface.js';
import type { IncomingMessage, ServerResponse } from 'node:http';

const RequestOriginScheme = 'https://';
const FallbackRequestHost = 'localhost';
const FallbackRequestPath = '/';
const FallbackRequestMethod = 'GET';
const BodylessRequestMethods = ['GET', 'HEAD'];

const createRequestUrl = (incomingRequest: IncomingMessage) => {
    const hostHeader = incomingRequest.headers.host;
    const host = typeof hostHeader === 'string' && hostHeader.length > 0 ? hostHeader : FallbackRequestHost;
    const path = typeof incomingRequest.url === 'string' && incomingRequest.url.length > 0 ? incomingRequest.url : FallbackRequestPath;

    return new URL(path, `${RequestOriginScheme}${host}`);
};

const createRequestHeaders = (incomingRequest: IncomingMessage) => {
    const requestHeaders = new Headers();

    for (const [headerName, headerValue] of Object.entries(incomingRequest.headers)) {
        if (typeof headerValue === 'string') {
            requestHeaders.set(headerName, headerValue);
        } else if (Array.isArray(headerValue)) {
            for (const repeatedHeaderValue of headerValue) {
                requestHeaders.append(headerName, repeatedHeaderValue);
            }
        }
    }

    return requestHeaders;
};

const createFetchRequest = async (incomingRequest: IncomingMessage) => {
    const method = typeof incomingRequest.method === 'string' ? incomingRequest.method : FallbackRequestMethod;
    const url = createRequestUrl(incomingRequest);
    const headers = createRequestHeaders(incomingRequest);

    if (BodylessRequestMethods.includes(method)) {
        return new Request(url, { headers, method });
    }

    const requestBody = await buffer(incomingRequest);

    return new Request(url, { body: new Uint8Array(requestBody), headers, method });
};

const writeFetchResponse = async (fetchResponse: Response, serverResponse: ServerResponse) => {
    const responseBody = fetchResponse.body === null ? null : new Uint8Array(await fetchResponse.arrayBuffer());

    serverResponse.writeHead(fetchResponse.status, Object.fromEntries(fetchResponse.headers));

    if (responseBody === null) {
        serverResponse.end();

        return;
    }

    serverResponse.write(responseBody);
    serverResponse.end();
};

export const createNodeHandler =
    (endpoint: FetchEndpoint) =>
    async (incomingRequest: IncomingMessage, serverResponse: ServerResponse): Promise<void> => {
        const fetchRequest = await createFetchRequest(incomingRequest);
        const fetchResponse = await endpoint.fetch(fetchRequest);

        await writeFetchResponse(fetchResponse, serverResponse);
    };
