import { expect, test } from '@playwright/test';

const sudokuCellCount = 81;
const hintDemoPath = '/learn-sudoku/hints';

test('serves the static hint-demo board before any JavaScript executes', async ({ request }) => {
    const response = await request.get(hintDemoPath);

    expect(response.ok()).toBeTruthy();

    const html = await response.text();

    expect(html.match(/<td class="sudoku-cell"/gu) ?? []).toHaveLength(sudokuCellCount);
    expect(html).toContain('Try the hint stepper');
});

test('walks a hint from the technique name to the walkthrough and applies it', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', error => pageErrors.push(error.message));

    await page.goto(hintDemoPath);
    await expect(page.locator('.field-board')).toHaveCount(0);

    await page.getByRole('button', { name: 'Try the hint stepper' }).click();
    await expect(page.locator('.field-board').getByRole('gridcell')).toHaveCount(sudokuCellCount);

    await page.getByRole('button', { name: 'Give me a hint' }).click();

    const hintPanel = page.getByRole('group', { name: 'Hint' });
    await expect(hintPanel).toContainText('Hint level: Technique');
    await expect(hintPanel).toContainText('Look for');

    const nextHintButton = hintPanel.getByRole('button', { name: 'Next hint' });
    await nextHintButton.click();
    await expect(hintPanel).toContainText('Hint level: Pattern');

    while (await nextHintButton.isEnabled()) {
        await nextHintButton.click();
    }

    await expect(hintPanel).toContainText('Hint level: Walkthrough');

    const applyButton = hintPanel.getByRole('button', { name: 'Apply to the board' });
    await expect(applyButton).toBeEnabled();
    await applyButton.click();

    await expect(page.getByRole('group', { name: 'Hint' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Give me a hint' })).toBeVisible();
    expect(pageErrors).toEqual([]);
});
