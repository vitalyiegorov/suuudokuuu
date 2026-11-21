import { expect, test } from '@playwright/test';

const minimumFooterOnlyLinks = 5;

test('scrolling to the footer does not prefetch footer-only pages', async ({ page }) => {
    const prefetchedPaths = new Set<string>();
    page.on('request', request => {
        if (request.headers()['next-router-prefetch'] === '1') {
            prefetchedPaths.add(new URL(request.url()).pathname.replace(/\/?__next\..*$/u, '') || '/');
        }
    });

    await page.goto('/');
    await page.locator('footer.site-footer').scrollIntoViewIfNeeded();
    await page.waitForLoadState('networkidle');

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
    expect(footerOnlyPaths.filter(path => prefetchedPaths.has(path))).toEqual([]);
});
