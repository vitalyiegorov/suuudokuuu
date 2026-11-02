import { setTimeout as sleep } from 'node:timers/promises';

import { getErrorMessage } from '@rnw-community/shared';

import { SITE_ORIGIN } from '../src/seo/constants/site.constant';

import { handleGeneratorError } from './utils/handle-generator-error.util';
import { readCanonical } from './utils/read-canonical.util';

const HTTP_OK = 200;
const CONCURRENCY = 8;
const REQUEST_TIMEOUT_MS = 15_000;
const RETRY_DELAY_MS = 5000;
const ROOT_FILE_PATHS = ['/robots.txt', '/llms.txt'];

const SitemapLocationPattern = /<loc>([^<]+)<\/loc>/gu;

const RobotsMetaPattern = /<meta\s[^>]*name=["']robots["'][^>]*>/giu;

const NoindexPattern = /noindex/iu;

const originFlagIndex = process.argv.indexOf('--origin');
const fetchOrigin = originFlagIndex === -1 ? SITE_ORIGIN : new URL(process.argv[originFlagIndex + 1] ?? '').origin;

const toFetchUrl = (url: string): string => {
    const { pathname, search } = new URL(url);

    return new URL(`${pathname}${search}`, fetchOrigin).href;
};

const fetchLive = (url: string): Promise<Response> =>
    fetch(toFetchUrl(url), { redirect: 'manual', signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });

const inspectLive = (url: string, inspectBody: (body: string) => string[]): (() => Promise<string[]>) => {
    const run = async (): Promise<string[]> => {
        const response = await fetchLive(url);

        return response.status === HTTP_OK ? inspectBody(await response.text()) : [`${url} answered ${response.status}`];
    };

    return () => run().catch((error: unknown) => [`${url} failed: ${getErrorMessage(error)}`]);
};

const inspectPage = (url: string, markup: string): string[] => {
    const canonical = readCanonical(markup);

    return [
        ...(canonical === new URL(url).href ? [] : [`${url} declares canonical ${canonical ?? 'none'}`]),
        ...((markup.match(RobotsMetaPattern) ?? []).some(tag => NoindexPattern.test(tag)) ? [`${url} carries a noindex robots meta`] : [])
    ];
};

const retryOnce = async (check: () => Promise<string[]>): Promise<string[]> => {
    const firstProblems = await check();

    if (firstProblems.length === 0) {
        return [];
    }

    await sleep(RETRY_DELAY_MS);

    return check();
};

const runInChunks = async (checks: (() => Promise<string[]>)[]): Promise<string[]> => {
    const problems: string[] = [];

    for (let start = 0; start < checks.length; start += CONCURRENCY) {
        const chunkProblems = await Promise.all(checks.slice(start, start + CONCURRENCY).map(retryOnce));

        problems.push(...chunkProblems.flat());
    }

    return problems;
};

const checkLiveSite = async (): Promise<void> => {
    const sitemapResponse = await fetchLive(`${SITE_ORIGIN}/sitemap.xml`);

    if (sitemapResponse.status !== HTTP_OK) {
        throw new Error(`${fetchOrigin}/sitemap.xml answered ${sitemapResponse.status}`);
    }

    const locations = Array.from((await sitemapResponse.text()).matchAll(SitemapLocationPattern), ([, location = '']) => location);

    const problems = await runInChunks([
        ...ROOT_FILE_PATHS.map(path => inspectLive(`${SITE_ORIGIN}${path}`, () => [])),
        ...locations.map(url => inspectLive(url, markup => inspectPage(url, markup)))
    ]);

    if (problems.length > 0) {
        throw new Error(problems.join('\n'));
    }

    process.stdout.write(`${locations.length} sitemap URLs live with matching canonicals\n`);
};

checkLiveSite().catch(handleGeneratorError);
