import { expect, test } from '@playwright/test';
import { SITE_PLAY_URL } from '@suuudokuuu/landing/src/seo/constants/site.constant';

const staticSudokuCellCount = 81;
const liveBoardGridCellCount = 81;
const eliminatedCandidateValue = '2';
const eliminatedCandidateCellLabel = 'r7c4, empty';
const playableCellLabel = 'r2c7, empty';
const playableDigitValue = '9';
const maxStepAdvanceAttempts = 5;

test('serves the full static worked example and prose before any JavaScript executes', async ({ request }) => {
    const response = await request.get('/techniques/x-wing');

    expect(response.ok()).toBeTruthy();

    const html = await response.text();
    const staticCellMatches = html.match(/<td class="sudoku-cell"/gu) ?? [];

    expect(staticCellMatches).toHaveLength(staticSudokuCellCount);
    expect(html).toContain('<h1>X-Wing');
    expect(html).toContain('Sudoku Technique</h1>');
    expect(html).toContain('An X-Wing is a fish pattern where a digit is confined to the same two lines');
    expect(html).toContain('<summary class="technique-embed__static-summary">Worked example diagram</summary>');
    expect(html).toContain('Try it on a live board');
    expect(html).not.toContain('Play full puzzles');
});

test('gates the live board behind intent, then walks the elimination and takes digit input', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', message => {
        if (message.type() === 'error') {
            consoleErrors.push(message.text());
        }
    });
    page.on('pageerror', error => consoleErrors.push(error.message));

    const scriptRequestUrls: string[] = [];
    page.on('request', requestObject => {
        if (requestObject.resourceType() === 'script') {
            scriptRequestUrls.push(requestObject.url());
        }
    });

    await page.goto('/techniques/x-wing');
    await expect(page.locator('td.sudoku-cell')).toHaveCount(staticSudokuCellCount);
    await page.waitForLoadState('networkidle');

    const scriptRequestCountBeforeGate = scriptRequestUrls.length;

    const staticDetails = page.locator('details.technique-embed__static');
    await expect(staticDetails).toHaveAttribute('open', '');

    await page.getByRole('button', { name: 'Try it on a live board' }).click();

    const liveBoard = page.locator('.field-board');
    await expect(liveBoard.getByRole('gridcell')).toHaveCount(liveBoardGridCellCount);

    expect(scriptRequestUrls.length).toBeGreaterThan(scriptRequestCountBeforeGate);

    await expect(staticDetails).toHaveCount(1);
    await expect(staticDetails.locator('td.sudoku-cell')).toHaveCount(staticSudokuCellCount);
    expect(await staticDetails.getAttribute('open')).toBeNull();

    await page.getByRole('button', { name: 'Show me the technique' }).click();

    const narration = page.locator('.field-step-player__narration');
    await expect(narration).toHaveText(/.+/u);
    await expect(liveBoard.locator("[data-pattern='true']").first()).toBeVisible();

    const targetCell = liveBoard.getByRole('gridcell', { name: eliminatedCandidateCellLabel });
    const targetCandidateIndex = Number(eliminatedCandidateValue) - 1;
    const targetCandidate = targetCell.locator('.field-cell__candidate').nth(targetCandidateIndex);

    const nextStepButton = page.locator('.field-step-player__controls').getByRole('button', { name: 'Next step' });

    for (let attempt = 0; attempt < maxStepAdvanceAttempts && (await nextStepButton.isEnabled()); attempt += 1) {
        await nextStepButton.click();
    }

    await expect(nextStepButton).toBeDisabled();
    await expect(targetCandidate).toHaveAttribute('data-eliminated', 'true');

    await page.locator('.field-step-player__controls').getByRole('button', { name: 'Apply to the board' }).click();

    await expect(narration).toHaveCount(0);
    await expect(liveBoard.locator("[data-pattern='true']")).toHaveCount(0);
    await expect(targetCandidate).toHaveAttribute('data-eliminated', 'false');

    await liveBoard.getByRole('gridcell', { name: playableCellLabel }).click();
    await page.getByRole('button', { name: new RegExp(`^Enter ${playableDigitValue},`, 'u') }).click();

    const selectedCell = liveBoard.locator("[aria-selected='true']");
    await expect(selectedCell.locator('.field-cell__value')).toHaveText(playableDigitValue);

    const playFullPuzzlesLink = page.locator('.technique-embed__footer a', { hasText: 'Play full puzzles' });
    await expect(playFullPuzzlesLink).toHaveAttribute('href', SITE_PLAY_URL);

    expect(consoleErrors).toEqual([]);
});
