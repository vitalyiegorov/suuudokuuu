import { expect } from '@playwright/test';
import { ChallengeAcceptScreenSelectors } from '@suuudokuuu/app/src/selectors';

import type { Page } from '@playwright/test';

const sharedChallengeAcceptTimeoutMilliseconds = 10000;

export const openSharedChallenge = async (page: Page, encodedChallenge: string): Promise<void> => {
    await page.goto(`/shared/${encodedChallenge}`);
    await expect(page.getByTestId(ChallengeAcceptScreenSelectors.Root)).toBeVisible({
        timeout: sharedChallengeAcceptTimeoutMilliseconds
    });
};
