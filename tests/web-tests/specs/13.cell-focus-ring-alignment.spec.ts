import { expect, test } from '@playwright/test';

import { launchHome } from '../src/utils/launch-home.util';
import { startNewGame } from '../src/utils/start-new-game.util';
import { cellTestId } from '../src/utils/test-id.util';

test('keeps board cells out of the tab order so the green selection stays the only cell indicator', async ({ page }) => {
    await launchHome(page);
    await startNewGame(page);

    const clickedCell = page.getByTestId(cellTestId(4, 4));
    await clickedCell.click();

    await expect(clickedCell).toHaveAttribute('tabindex', '-1');
    await expect(clickedCell).toHaveCSS('outline-style', 'none');

    await page.keyboard.press('ArrowDown');

    await expect(clickedCell).toHaveCSS('outline-style', 'none');
});

test('moves tab focus to a real control instead of walking through all 81 cells', async ({ page }) => {
    await launchHome(page);
    await startNewGame(page);

    await page.getByTestId(cellTestId(4, 4)).click();
    await page.keyboard.press('Tab');

    const focusedTestId = await page.evaluate(() => document.activeElement?.getAttribute('data-testid') ?? '');

    expect(focusedTestId).not.toMatch(/^CellSelectors\.Cell\./u);
});
