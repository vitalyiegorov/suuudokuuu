import { expect, test } from '@playwright/test';

import { fetchPageHtml } from '../../src/utils/fetch-page-html.util';

const solverPagePath = '/solver';

const entryCellCount = 81;
const liveBoardGridCellCount = 81;
const emptyPuzzleEntry = '.'.repeat(entryCellCount);
const contradictoryPuzzleEntry = `11${'.'.repeat(entryCellCount - 2)}`;

test('serves the solver shell, the entry grid and the article prose as static markup', async ({ request }) => {
    const html = await fetchPageHtml(request, solverPagePath);

    expect(html.match(/class="solver-entry__cell"/gu) ?? []).toHaveLength(entryCellCount);
    expect(html).toContain('<div class="solver-workbench">');
    expect(html).toContain('Solve step by step');
    expect(html).toContain('Or paste an 81-character puzzle');
    expect(html).toContain('A sudoku solver is a program that takes an unfinished 9×9 grid and returns the completed one.');
});

test('narrates a unique puzzle step by step and replays a step on a live board', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', message => {
        if (message.type() === 'error') {
            consoleErrors.push(message.text());
        }
    });
    page.on('pageerror', error => consoleErrors.push(error.message));

    await page.goto(solverPagePath);
    await page.getByRole('button', { name: 'Load a sample puzzle' }).click();
    await page.getByRole('button', { name: 'Solve step by step' }).click();

    await expect(page.locator('.solver-notice[data-tone="success"]')).toContainText('Verified unique');

    const steps = page.locator('.solver-steps__item');

    await expect(steps.first()).toBeVisible();
    await expect(steps.first().locator('.solver-steps__technique')).toHaveAttribute('href', /^\/techniques\//u);
    await expect(page.locator('.solver-result .puzzle-board td.sudoku-cell')).toHaveCount(entryCellCount);

    await steps.first().locator('.solver-steps__toggle').click();

    await expect(steps.first().locator('.solver-preview .field-board').getByRole('gridcell')).toHaveCount(liveBoardGridCellCount);
    await expect(steps.first().locator('.field-step-player__narration')).toHaveText(/.+/u);

    expect(consoleErrors).toEqual([]);
});

test('refuses to narrate an empty grid because it has more than one solution', async ({ page }) => {
    await page.goto(solverPagePath);

    await expect(page.locator('.solver-entry__input')).toHaveValue(emptyPuzzleEntry);

    await page.getByRole('button', { name: 'Solve step by step' }).click();

    await expect(page.locator('.solver-notice[data-tone="error"]')).toContainText('More than one solution');
});

test('reports a contradictory grid as having no solution', async ({ page }) => {
    await page.goto(solverPagePath);
    await page.locator('.solver-entry__input').fill(contradictoryPuzzleEntry);
    await page.getByRole('button', { name: 'Solve step by step' }).click();

    await expect(page.locator('.solver-notice[data-tone="error"]')).toContainText('No solution');
});
