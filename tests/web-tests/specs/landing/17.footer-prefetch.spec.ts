import { expect, test, type Request } from '@playwright/test';

const minimumFooterOnlyLinks = 5;
const footerPrefetchWindowMs = 3000;

test('scrolling to the footer does not prefetch footer-only pages', async ({ page }) => {
    const isPrefetch = (request: Request) => request.headers()['next-router-prefetch'] === '1';
    const pagePathOf = (request: Request) => new URL(request.url()).pathname.replace(/\/?__next\..*$/u, '') || '/';
    const prefetchedPaths = new Set<string>();
    page.on('request', request => {
        if (isPrefetch(request)) {
            prefetchedPaths.add(pagePathOf(request));
        }
    });

    const firstPrefetch = page.waitForRequest(isPrefetch);
    await page.goto('/');
    await firstPrefetch;

    const footerOnlyPaths = await page.evaluate(() => {
        const pathsOf = (selector: string) =>
            new Set(
                [...document.querySelectorAll<HTMLAnchorElement>(selector)]
                    .filter(anchor => anchor.host === location.host)
                    .map(anchor => anchor.pathname)
            );
        const outsideFooter = pathsOf('a[href]:not(footer a)');

        return [...pathsOf('footer a[href]')].filter(path => !outsideFooter.has(path));
    });

    expect(footerOnlyPaths.length).toBeGreaterThan(minimumFooterOnlyLinks);

    const footerPrefetch = page
        .waitForRequest(request => isPrefetch(request) && footerOnlyPaths.includes(pagePathOf(request)), {
            timeout: footerPrefetchWindowMs
        })
        .then(pagePathOf, () => null);
    await page.locator('footer.site-footer').scrollIntoViewIfNeeded();

    expect(await footerPrefetch).toBeNull();
    expect(footerOnlyPaths.filter(path => prefetchedPaths.has(path))).toEqual([]);
});
