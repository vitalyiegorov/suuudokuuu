import { expect, test } from '@playwright/test';
import { GameScreenSelectors, HomeScreenSelectors } from '@suuudokuuu/app/src/selectors';

import { launchHome } from '../src/utils/launch-home.util';
import { startNewGame } from '../src/utils/start-new-game.util';

test('redirects a cold /game entry with no active game back to home', async ({ page }) => {
    await page.goto('/game');
    await expect(page.getByTestId(HomeScreenSelectors.Root)).toBeVisible();
    await expect(page).toHaveURL('/');
});

test('redirects a cold /rating-explainer entry with an unparseable rating back to home', async ({ page }) => {
    await page.goto('/rating-explainer/abc');
    await expect(page.getByTestId(HomeScreenSelectors.Root)).toBeVisible();
    await expect(page).toHaveURL('/');
});

test('does not redirect /game away once a game is actually running', async ({ page }) => {
    await launchHome(page);
    await startNewGame(page);
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible();
    await expect(page).toHaveURL('/game');
});
