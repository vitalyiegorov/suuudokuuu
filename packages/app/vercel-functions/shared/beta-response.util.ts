import {
    BetaJsonContentType,
    BetaSuccessCdnCacheControl,
    BetaXmlContentType,
    HttpFoundStatus,
    HttpOkStatus
} from './beta-release.constant';

const NoStoreCacheControl = 'no-store';
const SuccessCacheControl = 'no-cache';

const createResponseHeaders = (isSuccess: boolean) => {
    const cacheControl = isSuccess ? SuccessCacheControl : NoStoreCacheControl;
    const cdnCacheControl = isSuccess ? BetaSuccessCdnCacheControl : NoStoreCacheControl;

    return {
        'Cache-Control': cacheControl,
        'Vercel-CDN-Cache-Control': cdnCacheControl,
        'X-Content-Type-Options': 'nosniff'
    };
};

export const createBetaJsonResponse = (body: unknown, status: number, isSuccess = false) =>
    new Response(JSON.stringify(body), {
        headers: { ...createResponseHeaders(isSuccess), 'Content-Type': BetaJsonContentType },
        status
    });

export const createBetaRedirectResponse = (location: string) =>
    new Response(null, {
        headers: { ...createResponseHeaders(true), Location: location },
        status: HttpFoundStatus
    });

export const createBetaXmlResponse = (body: string) =>
    new Response(body, {
        headers: { ...createResponseHeaders(false), 'Content-Type': BetaXmlContentType },
        status: HttpOkStatus
    });

export const createBetaHeadResponse = (response: Response) =>
    new Response(null, { headers: response.headers, status: response.status, statusText: response.statusText });
