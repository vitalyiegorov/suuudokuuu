import { expect, test } from '@playwright/test';

import { launchHome } from '../src/utils/launch-home.util';
import { startNewGame } from '../src/utils/start-new-game.util';
import { cellTestId } from '../src/utils/test-id.util';

test('does not leave a stray focus ring on a previously-clicked cell after arrow-key navigation moves the selection elsewhere', async ({
    page
}) => {
    await launchHome(page);
    await startNewGame(page);

    const clickedCell = page.getByTestId(cellTestId(4, 4));
    await clickedCell.click();
    await expect(clickedCell).toBeFocused();

    await page.keyboard.press('ArrowDown');

    await expect(clickedCell).toBeFocused();
    await expect(clickedCell).toHaveCSS('outline-style', 'none');
});
