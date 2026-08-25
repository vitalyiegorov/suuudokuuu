import { expect, test } from '@playwright/test';
import { SITE_ORIGIN } from '@suuudokuuu/landing/src/seo/constants/site.constant';

import { fetchPageHtml } from '../../src/utils/fetch-page-html.util';
import { readJsonLdSchema } from '../../src/utils/json-ld.util';

const homePath = '/';
const techniqueHubPath = '/techniques';
const techniquePagePath = '/techniques/x-wing';

const techniquePageCount = 26;
const breadcrumbDepth = 3;
const okStatus = 200;

const HeadingPattern = /<h1[^>]*>(.*?)<\/h1>/u;
const InternalLinkPattern = /href="(\/[^"]*)"/gu;

const readNavigationLinks = (html: string, ariaLabel: string): string[] => {
    const [navigation] = new RegExp(`<nav aria-label="${ariaLabel}"[^>]*>(.*?)</nav>`, 'su').exec(html)?.slice(1) ?? [];

    return Array.from(navigation.matchAll(InternalLinkPattern), match => match[1]);
};

test('every internal header and footer link resolves', async ({ request }) => {
    const html = await fetchPageHtml(request, homePath);
    const headerLinks = readNavigationLinks(html, 'Primary');
    const footerLinks = readNavigationLinks(html, 'Footer');
    const links = [...new Set([...headerLinks, ...footerLinks])];

    expect(headerLinks.length).toBeGreaterThan(0);
    expect(footerLinks.length).toBeGreaterThan(0);

    const statuses = await Promise.all(links.map(async link => `${link} ${(await request.get(link)).status()}`));

    expect(statuses).toEqual(links.map(link => `${link} ${okStatus}`));
});

test('the technique chain walks forward to the next technique and back again', async ({ page }) => {
    await page.goto(techniquePagePath);

    const chain = page.getByRole('navigation', { name: 'Technique difficulty chain' });
    const startHeading = await page.locator('h1').textContent();
    const nextTitle = await chain.getByRole('link').nth(1).locator('.page-chain__title').textContent();

    await chain.getByRole('link').nth(1).click();
    await expect(page.locator('h1')).toContainText(nextTitle ?? '');

    await page.getByRole('navigation', { name: 'Technique difficulty chain' }).getByRole('link').first().click();
    await expect(page.locator('h1')).toHaveText(startHeading ?? '');
});

test('breadcrumbs render the trail and mark the current page', async ({ page }) => {
    await page.goto(techniquePagePath);

    const items = page.locator('nav[aria-label="Breadcrumb"] .breadcrumbs__item');

    await expect(items).toHaveCount(breadcrumbDepth);
    await expect(items.nth(0).getByRole('link')).toHaveAttribute('href', homePath);
    await expect(items.nth(1).getByRole('link')).toHaveAttribute('href', techniqueHubPath);
    await expect(items.nth(breadcrumbDepth - 1)).toHaveAttribute('aria-current', 'page');
});

test('the technique hub lists every technique page and publishes the same list as structured data', async ({ request }) => {
    const html = await fetchPageHtml(request, techniqueHubPath);
    const listedPaths = Array.from(html.matchAll(/<li><a href="(\/techniques\/[^"]+)"/gu), match => match[1]);
    const expectedItems = listedPaths.map((path, index) => ({ '@type': 'ListItem', position: index + 1, url: `${SITE_ORIGIN}${path}` }));

    expect(listedPaths).toHaveLength(techniquePageCount);
    expect(new Set(listedPaths).size).toBe(techniquePageCount);
    expect(readJsonLdSchema(html, 'CollectionPage')).toMatchObject({
        mainEntity: { '@type': 'ItemList', numberOfItems: techniquePageCount, itemListElement: expectedItems }
    });
    expect(HeadingPattern.exec(html)?.[1]).toBe('Sudoku Techniques');
});
