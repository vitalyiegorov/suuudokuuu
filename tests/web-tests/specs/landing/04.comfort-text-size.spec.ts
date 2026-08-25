import { expect, test } from '@playwright/test';
import {
    COMFORT_SCALE_CSS_PROPERTY,
    COMFORT_SCALE_STEPS,
    COMFORT_SCALE_STORAGE_KEY,
    DEFAULT_COMFORT_SCALE_STEP
} from '@suuudokuuu/landing/src/chrome/constants/comfort-scale.constant';

import { fetchPageHtml } from '../../src/utils/fetch-page-html.util';

import type { Page } from '@playwright/test';

const techniquePagePath = '/techniques/x-wing';

const [, , LARGEST_COMFORT_SCALE_STEP] = COMFORT_SCALE_STEPS;

const readRootFontSize = async (page: Page): Promise<number> =>
    page.evaluate(() => Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize));

const readBoardCellWidth = async (page: Page): Promise<number> => {
    const box = await page.locator('td.sudoku-cell').first().boundingBox();

    return box?.width ?? 0;
};

test('renders the three text-size steps with the default one pressed', async ({ page }) => {
    await page.goto(techniquePagePath);

    const textSizeGroup = page.getByRole('group', { name: 'Text size' });

    await expect(textSizeGroup.getByRole('button')).toHaveText(COMFORT_SCALE_STEPS.map(step => step.symbol));
    await expect(textSizeGroup.getByRole('button', { name: DEFAULT_COMFORT_SCALE_STEP.label })).toHaveAttribute('aria-pressed', 'true');
    await expect(textSizeGroup.getByRole('button', { name: LARGEST_COMFORT_SCALE_STEP.label })).toHaveAttribute('aria-pressed', 'false');
});

test('grows the root type scale and the board with it, and keeps the choice across a reload', async ({ page }) => {
    await page.goto(techniquePagePath);
    await expect(page.locator('td.sudoku-cell').first()).toBeVisible();

    const defaultFontSize = await readRootFontSize(page);
    const defaultCellWidth = await readBoardCellWidth(page);

    await page.getByRole('button', { name: LARGEST_COMFORT_SCALE_STEP.label }).click();

    const textSizeGroup = page.getByRole('group', { name: 'Text size' });

    await expect(textSizeGroup.getByRole('button', { name: LARGEST_COMFORT_SCALE_STEP.label })).toHaveAttribute('aria-pressed', 'true');
    await expect(textSizeGroup.getByRole('button', { name: DEFAULT_COMFORT_SCALE_STEP.label })).toHaveAttribute('aria-pressed', 'false');

    const scaledFontSize = await readRootFontSize(page);

    expect(scaledFontSize).toBeCloseTo(defaultFontSize * LARGEST_COMFORT_SCALE_STEP.scale, 1);
    expect(await readBoardCellWidth(page)).toBeGreaterThan(defaultCellWidth);
    expect(await page.evaluate(key => window.localStorage.getItem(key), COMFORT_SCALE_STORAGE_KEY)).toBe(LARGEST_COMFORT_SCALE_STEP.id);

    await page.reload();

    await expect(textSizeGroup.getByRole('button', { name: LARGEST_COMFORT_SCALE_STEP.label })).toHaveAttribute('aria-pressed', 'true');
    expect(await readRootFontSize(page)).toBeCloseTo(scaledFontSize, 1);
    expect(await readBoardCellWidth(page)).toBeGreaterThan(defaultCellWidth);
});

test('ships the pre-paint comfort script ahead of the site chrome and exports the default scale', async ({ request }) => {
    const html = await fetchPageHtml(request, techniquePagePath);

    expect(html.indexOf(COMFORT_SCALE_STORAGE_KEY)).toBeLessThan(html.indexOf('<header class="site-header">'));
    expect(html).toContain(`setProperty('${COMFORT_SCALE_CSS_PROPERTY}'`);
    expect(html).not.toContain(`style="${COMFORT_SCALE_CSS_PROPERTY}`);
});
