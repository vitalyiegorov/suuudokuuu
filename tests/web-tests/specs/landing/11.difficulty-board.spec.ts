import { expect, test } from '@playwright/test';
import { DifficultyEnum, Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { buildDifficultyPlayUrl } from '@suuudokuuu/landing/src/difficulty/utils/build-difficulty-play-url.util';

const sudokuCellCount = 81;
const gridSize = 9;
const hardPagePath = '/sudoku/hard';

test('serves the Hard board in the static HTML and deep-links every play CTA to Hard', async ({ request }) => {
    const response = await request.get(hardPagePath);

    expect(response.ok()).toBeTruthy();

    const html = await response.text();

    expect(html.match(/<td class="sudoku-cell"/gu) ?? []).toHaveLength(sudokuCellCount);
    expect(html).toContain('Play this puzzle here');
    expect(html).toContain(`href="${buildDifficultyPlayUrl(DifficultyEnum.Hard)}"`);
    expect(html).not.toContain('Play Hard in the full app');
});

test('plays the Hard board in place after the reader asks for it', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', error => pageErrors.push(error.message));

    await page.goto(hardPagePath);

    const staticBoard = page.locator('.difficulty-board__static');
    await expect(staticBoard.locator('td.sudoku-cell')).toHaveCount(sudokuCellCount);

    const givens = (await staticBoard.locator('td.sudoku-cell').allTextContents()).map(text => text.trim() || '.').join('');
    const solution = Sudoku.fromString(givens, defaultSudokuConfig).FullField.flat();
    const blankIndex = givens.indexOf('.');
    const blankLabel = `r${Math.floor(blankIndex / gridSize) + 1}c${(blankIndex % gridSize) + 1}`;
    const blankValue = String(solution[blankIndex]?.value);

    await expect(page.locator('.field-board')).toHaveCount(0);
    await page.getByRole('button', { name: 'Play this puzzle here' }).click();

    const liveBoard = page.locator('.field-board');
    await expect(liveBoard.getByRole('gridcell')).toHaveCount(sudokuCellCount);
    await expect(staticBoard).toBeHidden();

    await liveBoard.getByRole('gridcell', { name: `${blankLabel}, empty` }).click();
    await page.getByRole('button', { name: new RegExp(`^Enter ${blankValue},`, 'u') }).click();
    await expect(liveBoard.getByRole('gridcell', { name: `${blankLabel}, ${blankValue}` })).toBeVisible();

    await expect(page.getByRole('link', { name: 'Play Hard in the full app' })).toHaveAttribute(
        'href',
        buildDifficultyPlayUrl(DifficultyEnum.Hard)
    );

    const readCellLabels = async () =>
        (await liveBoard.getByRole('gridcell').evaluateAll(cells => cells.map(cell => cell.ariaLabel))).join('|');
    const playedCellLabels = await readCellLabels();
    const newPuzzleButton = page.getByRole('button', { name: 'New Hard puzzle' });
    await newPuzzleButton.click();
    await expect.poll(readCellLabels).not.toBe(playedCellLabels);
    await expect(newPuzzleButton).toBeEnabled();

    expect(pageErrors).toEqual([]);
});
