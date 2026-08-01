import { expect } from '@playwright/test';
import { ChallengeResultScreenSelectors } from '@suuudokuuu/app/src/selectors';

import { acceptSharedChallenge } from './accept-shared-challenge.util';
import { openSharedChallenge } from './open-shared-challenge.util';
import { cellTestId, valueButtonTestId } from './test-id.util';

import type { Page } from '@playwright/test';

const challengeResultTimeoutMilliseconds = 5000;
const winningRemainingCellY = 6;
const winningRemainingCellX = 0;
const winningCellValue = 2;

export const completeWinningSharedChallenge = async (page: Page, encodedChallenge: string): Promise<void> => {
    await openSharedChallenge(page, encodedChallenge);
    await expect(page.getByText('Their time to beat')).toBeVisible();
    await acceptSharedChallenge(page);
    await page.getByTestId(cellTestId(winningRemainingCellY, winningRemainingCellX)).click();
    await page.getByTestId(valueButtonTestId(winningCellValue)).click();
    await expect(page.getByTestId(ChallengeResultScreenSelectors.Root)).toBeVisible({ timeout: challengeResultTimeoutMilliseconds });
};
