import { expect, test } from '@playwright/test';

import { pointingPairHintSharedPuzzleEncodedConstant } from '../../src/constants/shared-challenge-links.constant';
import { fetchPageHtml } from '../../src/utils/fetch-page-html.util';

const solverPagePath = '/solver';

const entryCellCount = 81;
const liveBoardGridCellCount = 81;
const emptyPuzzleEntry = '.'.repeat(entryCellCount);
const contradictoryPuzzleEntry = `11${'.'.repeat(entryCellCount - 2)}`;
const pastedPuzzle = '000260701680070090190004500820100040004602900050003028009300074040050036703018000';
const sharedPuzzleLink = `https://www.suuudokuuu.com/shared/${pointingPairHintSharedPuzzleEncodedConstant}`;
const sharedPuzzleEntry = '.3.1.......17..63.5..623..1...2...13..38.1..61..3.48..357986142894512367.1.437.8.';
const steppedThroughCount = 3;

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

test('steps through a pasted puzzle from the first move to the finished grid', async ({ page }) => {
    await page.goto(solverPagePath);
    await page.locator('.solver-entry__input').fill(pastedPuzzle);
    await page.getByRole('button', { name: 'Solve step by step' }).click();

    await expect(page.locator('.solver-result .solver-output')).toContainText('SE rating');

    const steps = page.locator('.solver-steps__item');
    const stepStatus = page.locator('.solver-step-controls__status');

    await page.getByRole('button', { name: 'Step through from the start' }).click();
    await expect(stepStatus).toHaveText(/^Step 1 of \d+$/u);

    for (let stepNumber = 2; stepNumber <= steppedThroughCount; stepNumber += 1) {
        await page.getByRole('button', { name: 'Go to the next step' }).click();
        await expect(stepStatus).toHaveText(new RegExp(`^Step ${stepNumber} of \\d+$`, 'u'));
    }

    await steps.last().locator('.solver-steps__toggle').click();

    await expect(stepStatus).toContainText('the last one');
    await expect(page.getByRole('button', { name: 'Go to the next step' })).toBeDisabled();
    await expect(steps.last().locator('.solver-preview .field-board').getByRole('gridcell')).toHaveCount(liveBoardGridCellCount);
});

test('imports a puzzle from a Suuudokuuu share link', async ({ page }) => {
    await page.goto(solverPagePath);
    await page.locator('.solver-entry__input').fill(sharedPuzzleLink);

    await expect(page.locator('.solver-entry__input')).toHaveValue(sharedPuzzleEntry);
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

    await expect(page.locator('.solver-notice[data-tone="error"]')).toContainText('No solution — r1c1 and r1c2 both hold 1 in row 1');
});
