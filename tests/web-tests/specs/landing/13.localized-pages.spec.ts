import { expect, test } from '@playwright/test';
import { easySudokuPageMetadata } from '@suuudokuuu/landing/src/app/(en)/sudoku/easy/metadata';
import { SITE_ORIGIN } from '@suuudokuuu/landing/src/seo/constants/site.constant';

import { fetchPageHtml } from '../../src/utils/fetch-page-html.util';

const arabicEasyPath = '/ar/sudoku/easy';
const spanishEasyPath = '/es/sudoku/easy';

test('serves a right-to-left tier page with its own canonical, title and localized sibling links', async ({ request }) => {
    const html = await fetchPageHtml(request, arabicEasyPath);

    expect(html).toContain('<html dir="rtl" lang="ar">');
    expect(html).toContain(`<h1>${easySudokuPageMetadata.translations?.ar?.headline}</h1>`);
    expect(html).toContain(`<link rel="canonical" href="${SITE_ORIGIN}${arabicEasyPath}"/>`);
    expect(html).toContain('href="/ar/sudoku/medium"');
});

test('links the localized booklet on Latin-script locales and the English booklet elsewhere', async ({ request }) => {
    expect(await fetchPageHtml(request, '/de/printable/hard')).toContain('href="/de/printable/hard.pdf"');
    expect(await fetchPageHtml(request, '/uk/printable/hard')).toContain('href="/printable/hard.pdf"');
});

test('opens the live board with its labels in the page language', async ({ page }) => {
    await page.goto(spanishEasyPath);
    await page.getByRole('button', { name: 'Juega este sudoku aquí' }).click();

    await expect(page.getByRole('grid', { name: 'Tablero de sudoku interactivo' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Juega en Fácil en la app completa' })).toBeVisible();
});
