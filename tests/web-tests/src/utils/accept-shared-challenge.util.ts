import { expect } from '@playwright/test';
import { ChallengeAcceptScreenSelectors, GameScreenSelectors } from '@suuudokuuu/app/src/selectors';

import type { Page } from '@playwright/test';

const gameScreenTimeoutMilliseconds = 10000;

export const acceptSharedChallenge = async (page: Page): Promise<void> => {
    await page.getByTestId(ChallengeAcceptScreenSelectors.AcceptButton).click();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible({ timeout: gameScreenTimeoutMilliseconds });
};
