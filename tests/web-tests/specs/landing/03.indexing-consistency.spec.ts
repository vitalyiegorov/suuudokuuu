import { expect, test } from '@playwright/test';
import { AI_CRAWLER_USER_AGENTS } from '@suuudokuuu/landing/src/seo/constants/crawler.constant';
import { DEFAULT_LOCALE, SITE_ORIGIN, SUPPORTED_LOCALES } from '@suuudokuuu/landing/src/seo/constants/site.constant';

const sitemapPath = '/sitemap.xml';
const robotsPath = '/robots.txt';
const llmsPath = '/llms.txt';

const techniquePageCount = 35;
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

test('robots.txt advertises the sitemap and allows crawlers to load rendering assets', async ({ request }) => {
    const response = await request.get(robotsPath);

    expect(response.status()).toBe(okStatus);

    const robots = await response.text();

    expect(robots).toContain(`Sitemap: ${SITE_ORIGIN}${sitemapPath}`);
    expect(robots).not.toMatch(/^Disallow:\s*\/_next(?:\/|\s|$)/gmu);
    expect(robots).toContain('Allow: /');

    for (const userAgent of AI_CRAWLER_USER_AGENTS) {
        expect(robots).toContain(`User-Agent: ${userAgent}\nAllow: /`);
    }
});

test('llms.txt enumerates exactly the English sitemap URL set and llms-full.txt contains every answer', async ({ request }) => {
    const llmsResponse = await request.get(llmsPath);

    expect(llmsResponse.status(), 'llms.txt is written into public/ by the landing build, so the export always carries it').toBe(okStatus);

    const llms = await llmsResponse.text();
    const llmsUrls = Array.from(llms.matchAll(LlmsLinkPattern), match => match[1]);
    const sitemapUrls = readSitemapUrls(await (await request.get(sitemapPath)).text());

    const localizedPrefixes = SUPPORTED_LOCALES.filter(locale => locale !== DEFAULT_LOCALE).map(locale => `/${locale.toLowerCase()}`);
    const englishSitemapUrls = sitemapUrls.filter(url => {
        const { pathname } = new URL(url);

        return !localizedPrefixes.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`));
    });
    const fullResponse = await request.get('/llms-full.txt');

    expect(fullResponse.status()).toBe(okStatus);
    expect(fullResponse.headers()['content-type']).toContain('text/plain');

    const fullText = await fullResponse.text();

    expect(llmsUrls.length).toBe(new Set(llmsUrls).size);
    for (const url of llmsUrls) {
        expect(fullText).toContain(`URL: ${url}\n`);
    }
    expect(llms).toContain(`${SITE_ORIGIN}${sitemapPath}`);
    expect([...new Set(llmsUrls)].sort()).toEqual([...englishSitemapUrls].sort());
});
