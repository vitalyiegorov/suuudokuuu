import { expect, test } from '@playwright/test';
import { DailyScreenSelectors, HomeScreenSelectors, MainTabSelectors } from '@suuudokuuu/app/src/selectors';

import { launchHome } from '../src/utils/launch-home.util';

test('the play screen shows the tab bar and the Play tab returns to /play', async ({ page }) => {
    await launchHome(page);
    await expect(page.getByTestId(MainTabSelectors.Play)).toBeVisible();

    await page.getByTestId(MainTabSelectors.Daily).click();
    await expect(page.getByTestId(DailyScreenSelectors.Root)).toBeVisible();
    await expect(page).toHaveURL('/daily');

    await page.getByTestId(MainTabSelectors.Play).click();
    await expect(page.getByTestId(HomeScreenSelectors.Root)).toBeVisible();
    await expect(page).toHaveURL('/play');
    await expect(page.getByTestId(MainTabSelectors.Daily)).toBeVisible();
});
