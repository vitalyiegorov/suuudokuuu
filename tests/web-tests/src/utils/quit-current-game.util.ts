import { expect } from '@playwright/test';
import { GameScreenSelectors, HomeScreenSelectors } from '@suuudokuuu/app/src/selectors';

import type { Page } from '@playwright/test';

const homeScreenTimeoutMilliseconds = 3000;

export const quitCurrentGame = async (page: Page, quitButtonTestId: string = GameScreenSelectors.QuitButton): Promise<void> => {
    page.once('dialog', dialog => void dialog.accept());
    await page.getByTestId(quitButtonTestId).click();
    await expect(page.getByTestId(HomeScreenSelectors.Root)).toBeVisible({ timeout: homeScreenTimeoutMilliseconds });
};
