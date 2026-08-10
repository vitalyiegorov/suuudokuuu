import { expect, test } from '@playwright/test';
import {
    DifficultyComplexityOptionSelectors,
    GameScreenSelectors,
    HomeScreenSelectors,
    RatingBadgeSelectors,
    SharedScreenSelectors
} from '@suuudokuuu/app/src/selectors';

import { infinitySharedPuzzleEncodedConstant } from '../src/constants/shared-challenge-links.constant';
import { launchHome } from '../src/utils/launch-home.util';
import { openSharedPuzzle } from '../src/utils/open-shared-puzzle.util';
import { quitCurrentGame } from '../src/utils/quit-current-game.util';

const gameScreenTimeoutMilliseconds = 15000;
const infinityOptionTestId = `${DifficultyComplexityOptionSelectors.Option}.Infinity`;

test('starts a curated Infinity puzzle from the home screen with its rating visible', async ({ page }) => {
    await launchHome(page);

    await page.getByTestId(infinityOptionTestId).click();
    const homeScreen = page.getByTestId(HomeScreenSelectors.Root);
    await expect(homeScreen.getByText('World-record puzzles', { exact: true })).toBeVisible();

    await page.getByTestId(HomeScreenSelectors.StartButton).click();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible({ timeout: gameScreenTimeoutMilliseconds });
    await expect(page.getByTestId(GameScreenSelectors.Level)).toHaveText('Infinity');
    await expect(page.getByTestId(GameScreenSelectors.Rating)).toBeVisible();

    await quitCurrentGame(page);
});

test('round-trips a shared Infinity link end to end with the rating badge visible', async ({ page }) => {
    await launchHome(page);
    await openSharedPuzzle(page, infinitySharedPuzzleEncodedConstant);

    const meta = page.getByTestId(SharedScreenSelectors.Meta);
    await expect(meta.getByText('Infinity', { exact: true })).toBeVisible();
    await expect(meta.getByTestId(RatingBadgeSelectors.Root)).toBeVisible();

    await page.getByTestId(SharedScreenSelectors.ConfirmButton).click();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible({ timeout: gameScreenTimeoutMilliseconds });
    await expect(page.getByTestId(GameScreenSelectors.Level)).toHaveText('Infinity');
    await expect(page.getByTestId(GameScreenSelectors.Rating)).toBeVisible();

    await quitCurrentGame(page);
});
