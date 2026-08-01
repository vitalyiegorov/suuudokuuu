import { expect } from '@playwright/test';
import { HomeScreenSelectors } from '@suuudokuuu/app/src/selectors';

import type { Page } from '@playwright/test';

const homeLaunchTimeoutMilliseconds = 15000;

export const launchHome = async (page: Page): Promise<void> => {
    await page.goto('/');
    await expect(page.getByTestId(HomeScreenSelectors.Root)).toBeVisible({ timeout: homeLaunchTimeoutMilliseconds });
};
