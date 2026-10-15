import { expect, test } from '@playwright/test';
import { homePageMetadata } from '@suuudokuuu/landing/src/app/(en)/metadata';
import { SITE_ORIGIN } from '@suuudokuuu/landing/src/seo/constants/site.constant';

import { fetchPageHtml } from '../../src/utils/fetch-page-html.util';
import { readJsonLdSchema } from '../../src/utils/json-ld.util';

const spanishHomePath = '/es';
const englishOnlyPagePath = '/techniques/x-wing';

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
