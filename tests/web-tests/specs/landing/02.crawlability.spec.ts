import { expect, test } from '@playwright/test';
import { homePageMetadata } from '@suuudokuuu/landing/src/app/(en)/metadata';
import { SITE_ORIGIN } from '@suuudokuuu/landing/src/seo/constants/site.constant';
import { resolvePageHeadline } from '@suuudokuuu/landing/src/seo/utils/resolve-page-headline.util';

import { fetchPageHtml } from '../../src/utils/fetch-page-html.util';
import { readJsonLdSchema } from '../../src/utils/json-ld.util';

const homePath = '/';
const techniquePagePath = '/techniques/x-wing';
const difficultyLanderPath = '/sudoku/hard';
const guidePagePath = '/guides/sudoku-difficulty-rating';
const techniqueHubPath = '/techniques';
const collectionPagePaths = [techniqueHubPath, '/sudoku', '/printable'];

const articlePagePaths = [techniquePagePath, difficultyLanderPath, guidePagePath];
const sampledPagePaths = [homePath, techniquePagePath, difficultyLanderPath, guidePagePath, techniqueHubPath];

const staticSudokuCellCount = 81;
const ratedTierCount = 6;
const singleHeadingCount = 1;
const okStatus = 200;

const HeadingPattern = /<h1[^>]*>(.*?)<\/h1>/gu;
const CanonicalPattern = /<link rel="canonical" href="([^"]+)"/u;
const OgImagePattern = /<meta property="og:image" content="([^"]+)"/u;
const MarkupTagPattern = /<[^<>]+>/gu;

const stripMarkupTags = (text: string): string => {
    let strippedText = text;
    let previousText = '';
    while (strippedText !== previousText) {
        previousText = strippedText;
        strippedText = strippedText.replaceAll(MarkupTagPattern, '');
    }

    return strippedText;
};

const readHeadings = (html: string): string[] => Array.from(html.matchAll(HeadingPattern), match => stripMarkupTags(match[1]));

test('serves the whole technique worked example as static markup before any JavaScript executes', async ({ request }) => {
    const html = await fetchPageHtml(request, techniquePagePath);
    const candidateGridMatches = html.match(/<span class="sudoku-cell__candidates"/gu) ?? [];

    expect(html.match(/<td class="sudoku-cell"/gu) ?? []).toHaveLength(staticSudokuCellCount);
    expect(candidateGridMatches.length).toBeGreaterThan(0);
    expect(html).toContain('<dl class="solver-output"><dt class="solver-output__term">Pattern cells</dt>');
    expect(html).toContain('<aside aria-label="Summary" class="technique-summary">');
    expect(html).toContain('An X-Wing is a fish pattern where a digit is confined to the same two lines');
});

test('serves the guide measured-data tables as static markup', async ({ request }) => {
    const html = await fetchPageHtml(request, guidePagePath);
    const tierRowMatches = html.match(/<th scope="row"><a href="\/sudoku\//gu) ?? [];

    expect(html.match(/<table class="data-table">/gu) ?? []).toHaveLength(2);
    expect(html).toContain('<th scope="col">SE range</th>');
    expect(html).toContain('<th scope="col">Technique</th>');
    expect(tierRowMatches).toHaveLength(ratedTierCount);
    expect(html).toMatch(/<a href="\/sudoku\/newbie">Newbie<\/a><\/th><td>\d+<\/td>/u);
});

for (const path of sampledPagePaths) {
    test(`declares exactly one heading, one canonical and one exported Open Graph image on ${path}`, async ({ request }) => {
        const html = await fetchPageHtml(request, path);
        const [canonicalUrl] = CanonicalPattern.exec(html)?.slice(1) ?? [];
        const [ogImageUrl] = OgImagePattern.exec(html)?.slice(1) ?? [];

        expect(readHeadings(html)).toHaveLength(singleHeadingCount);
        expect(canonicalUrl).toContain(SITE_ORIGIN);
        expect(ogImageUrl).toContain(`${SITE_ORIGIN}/og/`);

        const ogImageResponse = await request.get(ogImageUrl.replace(SITE_ORIGIN, ''));

        expect(ogImageResponse.status()).toBe(okStatus);
        expect(ogImageResponse.headers()['content-type']).toContain('image/png');
    });
}

for (const path of articlePagePaths) {
    test(`publishes Article structured data whose headline is the rendered heading on ${path}`, async ({ request }) => {
        const html = await fetchPageHtml(request, path);
        const [heading] = readHeadings(html);

        expect(readJsonLdSchema(html, 'Article')).toMatchObject({
            headline: heading,
            url: `${SITE_ORIGIN}${path}`,
            inLanguage: 'en'
        });
        expect(readJsonLdSchema(html, 'BreadcrumbList')).not.toBeNull();
    });
}

test('keeps the home page out of the Article family and publishes site-level structured data instead', async ({ request }) => {
    const html = await fetchPageHtml(request, homePath);

    expect(readJsonLdSchema(html, 'Article')).toBeNull();
    expect(readJsonLdSchema(html, 'WebSite')).not.toBeNull();
    expect(readJsonLdSchema(html, 'SoftwareApplication')).not.toBeNull();
});

for (const path of collectionPagePaths) {
    test(`publishes CollectionPage rather than Article structured data on ${path}`, async ({ request }) => {
        const html = await fetchPageHtml(request, path);

        expect(readJsonLdSchema(html, 'CollectionPage')).toMatchObject({ url: `${SITE_ORIGIN}${path}` });
        expect(readJsonLdSchema(html, 'Article')).toBeNull();
    });
}

test('keeps the home headline consistent with its visible title and describes seven difficulty levels', async ({ request }) => {
    const html = await fetchPageHtml(request, homePath);

    expect(readHeadings(html)).toEqual(['Play Free Online Sudoku']);
    expect(html).toMatch(/<meta name="description" content="[^"]*[Ss]even difficulty levels/u);
    expect(readHeadings(html)).toEqual([resolvePageHeadline(homePageMetadata)]);
});

test('keeps the visible technique instructions without publishing HowTo structured data', async ({ request }) => {
    const html = await fetchPageHtml(request, techniquePagePath);

    expect(readJsonLdSchema(html, 'HowTo')).toBeNull();
    expect(html).toMatch(/<ol[^>]*class="how-to"/u);
    expect(html.match(/class="how-to__step"/gu) ?? []).toHaveLength(4);
    expect(html).toContain('Pick a digit and scan the rows');
    expect(html).toContain('Erase the digit from the rest of both columns');
});
