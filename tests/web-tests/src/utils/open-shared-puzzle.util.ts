import { expect } from '@playwright/test';
import { SharedScreenSelectors } from '@suuudokuuu/app/src/selectors';

import type { Page } from '@playwright/test';

const sharedPuzzleTimeoutMilliseconds = 10000;

export const openSharedPuzzle = async (page: Page, encodedPuzzle: string): Promise<void> => {
    await page.goto(`/shared/${encodedPuzzle}`);
    await expect(page.getByTestId(SharedScreenSelectors.Root)).toBeVisible({ timeout: sharedPuzzleTimeoutMilliseconds });
};
