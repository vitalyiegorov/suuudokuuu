import { expect } from '@playwright/test';
import { HomeScreenSelectors, PauseScreenSelectors } from '@suuudokuuu/app/src/selectors';

import type { Page } from '@playwright/test';

const homeScreenTimeoutMilliseconds = 3000;

export const quitPausedGame = async (page: Page): Promise<void> => {
    page.once('dialog', dialog => void dialog.accept());
    await page.getByTestId(PauseScreenSelectors.QuitButton).click();
    await expect(page.getByTestId(HomeScreenSelectors.Root)).toBeVisible({ timeout: homeScreenTimeoutMilliseconds });
};
