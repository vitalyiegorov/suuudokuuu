import { expect, test } from '@playwright/test';
import { SITE_ORIGIN } from '@suuudokuuu/landing/src/seo/constants/site.constant';

const sitemapPath = '/sitemap.xml';
const robotsPath = '/robots.txt';
const llmsPath = '/llms.txt';

const techniquePageCount = 26;
const okStatus = 200;

const SitemapLocationPattern = /<loc>([^<]+)<\/loc>/gu;
const LlmsLinkPattern = /\]\((https:\/\/[^)\s]+)\)/gu;

const readSitemapUrls = (sitemap: string): string[] => Array.from(sitemap.matchAll(SitemapLocationPattern), match => match[1]);

test('every sitemap URL is a unique canonical-origin page the static export actually serves', async ({ request }) => {
    const sitemapResponse = await request.get(sitemapPath);

    expect(sitemapResponse.status()).toBe(okStatus);

    const urls = readSitemapUrls(await sitemapResponse.text());
    const techniqueUrls = urls.filter(url => url.startsWith(`${SITE_ORIGIN}/techniques/`));

    expect(urls.length).toBeGreaterThan(techniquePageCount);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.every(url => url.startsWith(SITE_ORIGIN))).toBe(true);
    expect(techniqueUrls).toHaveLength(techniquePageCount);

    const statuses = await Promise.all(urls.map(async url => `${url} ${(await request.get(new URL(url).pathname)).status()}`));

    expect(statuses).toEqual(urls.map(url => `${url} ${okStatus}`));
});

test('robots.txt advertises the sitemap and keeps the build output out of the index', async ({ request }) => {
    const response = await request.get(robotsPath);

    expect(response.status()).toBe(okStatus);

    const robots = await response.text();

    expect(robots).toContain(`Sitemap: ${SITE_ORIGIN}${sitemapPath}`);
    expect(robots).toContain('Disallow: /_next/');
    expect(robots).toContain('Allow: /');
});

test('llms.txt enumerates exactly the sitemap URL set', async ({ request }) => {
    const llmsResponse = await request.get(llmsPath);

    expect(llmsResponse.status(), 'llms.txt is written into public/ by the landing build, so the export always carries it').toBe(okStatus);

    const llms = await llmsResponse.text();
    const llmsUrls = Array.from(llms.matchAll(LlmsLinkPattern), match => match[1]);
    const sitemapUrls = readSitemapUrls(await (await request.get(sitemapPath)).text());

    expect(llms).toContain(`${SITE_ORIGIN}${sitemapPath}`);
    expect([...new Set(llmsUrls)].sort()).toEqual([...sitemapUrls].sort());
});
