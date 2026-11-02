import { expect, test } from '@playwright/test';
import { DAILY_BUILD_DATE } from '@suuudokuuu/landing/src/daily/constants/daily-archive.constant';
import { SITE_ORIGIN } from '@suuudokuuu/landing/src/seo/constants/site.constant';

import { isRecord, isString } from '@rnw-community/shared';

import { fetchPageHtml } from '../../src/utils/fetch-page-html.util';
import { readJsonLdSchema, readJsonLdSchemas } from '../../src/utils/json-ld.util';

const pagePaths = [
    '/',
    '/de',
    '/techniques/x-wing',
    '/guides/sudoku-difficulty-rating',
    '/sudoku/hard',
    '/about',
    `/daily-sudoku/${DAILY_BUILD_DATE}`,
    '/hardest-sudoku-puzzles'
];

const collectNodes = (value: unknown): Record<string, unknown>[] => {
    if (Array.isArray(value)) {
        return value.flatMap(collectNodes);
    }
    if (!isRecord(value)) {
        return [];
    }

    return [value, ...Object.values(value).flatMap(collectNodes)];
};

for (const path of pagePaths) {
    test(`keeps JSON-LD identities consistent on ${path}`, async ({ request }) => {
        const nodes = collectNodes(readJsonLdSchemas(await fetchPageHtml(request, path)));
        const identifiedNodes = new Map<string, Record<string, unknown>>();

        expect(nodes.length).toBeGreaterThan(0);
        for (const node of nodes) {
            const identifier = node['@id'];

            if (node['@type'] === 'Organization' || node['@type'] === 'Person') {
                expect(identifier).toEqual(expect.any(String));
            }
            if (node['@type'] === 'Organization') {
                expect(identifier).toBe(`${SITE_ORIGIN}/#organization`);
            }
            if (isString(identifier)) {
                expect(node).toEqual(identifiedNodes.get(identifier) ?? node);
                identifiedNodes.set(identifier, node);
            }
        }
    });
}

test('dates the daily Article to its puzzle date', async ({ request }) => {
    const html = await fetchPageHtml(request, `/daily-sudoku/${DAILY_BUILD_DATE}`);

    expect(readJsonLdSchema(html, 'Article')).toMatchObject({ datePublished: `${DAILY_BUILD_DATE}T00:00:00.000Z` });
});
