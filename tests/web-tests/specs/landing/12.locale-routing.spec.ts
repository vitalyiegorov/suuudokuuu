import { expect, test } from '@playwright/test';
import { homePageMetadata } from '@suuudokuuu/landing/src/app/(en)/metadata';
import { SITE_ORIGIN } from '@suuudokuuu/landing/src/seo/constants/site.constant';

import { fetchPageHtml } from '../../src/utils/fetch-page-html.util';
import { readJsonLdSchema } from '../../src/utils/json-ld.util';

const spanishHomePath = '/es';
const englishOnlyPagePath = '/techniques/x-wing';
const narrowViewportWidth = 320;

test('serves the Spanish home page as a Spanish document in the home hreflang cluster', async ({ request }) => {
    const html = await fetchPageHtml(request, spanishHomePath);

    expect(html).toContain('<html dir="ltr" lang="es">');
    expect(html).toContain(`<h1>${homePageMetadata.translations?.es?.headline}</h1>`);
    expect(html).toContain(`<link rel="canonical" href="${SITE_ORIGIN}${spanishHomePath}"/>`);
    expect(html).toContain(`<link rel="alternate" hrefLang="en" href="${SITE_ORIGIN}"/>`);
    expect(html).toContain(`<link rel="alternate" hrefLang="x-default" href="${SITE_ORIGIN}"/>`);
    expect(readJsonLdSchema(html, 'WebSite')).toMatchObject({ url: `${SITE_ORIGIN}${spanishHomePath}`, inLanguage: 'es' });
});

test('offers the language switcher only on pages published in more than one language', async ({ page }) => {
    await page.goto('/');

    const languages = page.getByRole('navigation', { name: 'Language' });

    await languages.locator('summary').click();
    await expect(languages.getByRole('link', { name: 'English' })).toHaveAttribute('aria-current', 'page');
    await languages.getByRole('link', { name: 'Español' }).click();
    await expect(page).toHaveURL(spanishHomePath);

    const spanishLanguages = page.getByRole('navigation', { name: 'Idioma' });

    await spanishLanguages.locator('summary').click();
    await expect(spanishLanguages.getByRole('link', { name: 'Español' })).toHaveAttribute('aria-current', 'page');

    await page.goto(englishOnlyPagePath);

    await expect(page.getByRole('navigation', { name: 'Language' })).toHaveCount(0);
});

for (const pagePath of ['/how-to-play', '/ar/how-to-play']) {
    test(`keeps the language menu inside a narrow viewport without moving the header on ${pagePath}`, async ({ page }) => {
        await page.setViewportSize({ width: narrowViewportWidth, height: 640 });
        await page.goto(pagePath);

        const header = page.locator('.site-header');
        const headerBoxBefore = await header.boundingBox();
        const navigationTopBefore = (await page.locator('.site-header__nav').boundingBox())?.y;

        await page.locator('.language-switcher summary').click();

        const menuBox = await page.locator('.language-switcher__list').boundingBox();

        expect(menuBox?.x).toBeGreaterThanOrEqual(0);
        expect((menuBox?.x ?? 0) + (menuBox?.width ?? 0)).toBeLessThanOrEqual(narrowViewportWidth);
        expect(await header.boundingBox()).toEqual(headerBoxBefore);
        expect((await page.locator('.site-header__nav').boundingBox())?.y).toBe(navigationTopBefore);
    });
}
