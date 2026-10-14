import { expect, test } from '@playwright/test';
import { HomeScreenSelectors } from '@suuudokuuu/app/src/selectors';

import { getVisibleByTestId } from '../src/utils/visible-locator.util';

test('a landing tier link preselects that difficulty on Play and ignores unknown values', async ({ page }) => {
    await page.goto('/play?difficulty=Hard');
    await expect(getVisibleByTestId(page, HomeScreenSelectors.StartButton)).toContainText('Hard');

    await page.goto('/play?difficulty=Newbie');
    await expect(getVisibleByTestId(page, HomeScreenSelectors.StartButton)).toContainText('Newbie');

    await page.goto('/play?difficulty=Impossible');
    await expect(getVisibleByTestId(page, HomeScreenSelectors.StartButton)).toContainText('Newbie');
});
