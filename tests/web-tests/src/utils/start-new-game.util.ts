import { expect } from '@playwright/test';
import { GameScreenSelectors, HomeScreenSelectors } from '@suuudokuuu/app/src/selectors';

import type { Page } from '@playwright/test';

const gameScreenTimeoutMilliseconds = 15000;

export const startNewGame = async (page: Page): Promise<void> => {
    await page.getByTestId(HomeScreenSelectors.StartButton).click();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible({ timeout: gameScreenTimeoutMilliseconds });
    await expect(page.getByTestId(HomeScreenSelectors.Root)).not.toBeVisible();
    await expect(page.getByTestId(/^CellSelectors\.Cell\./u).first()).toBeVisible();
    await expect(page.getByTestId(/^AvailableValueItemSelectors\.Button\./u).first()).toBeVisible();
};
