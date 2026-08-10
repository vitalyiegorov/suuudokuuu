import { expect, test } from '@playwright/test';
import {
    DifficultyComplexityOptionSelectors,
    GameScreenSelectors,
    HomeScreenSelectors,
    RatingBadgeSelectors,
    RatingExplainerSelectors,
    SharedScreenSelectors
} from '@suuudokuuu/app/src/selectors';

import { infinitySharedPuzzleEncodedConstant } from '../src/constants/shared-challenge-links.constant';
import { launchHome } from '../src/utils/launch-home.util';
import { openSharedPuzzle } from '../src/utils/open-shared-puzzle.util';
import { quitCurrentGame } from '../src/utils/quit-current-game.util';

const gameScreenTimeoutMilliseconds = 15000;
const infinityOptionTestId = `${DifficultyComplexityOptionSelectors.Option}.Infinity`;

test('starts a curated Infinity puzzle from the home screen with its rating visible', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', error => pageErrors.push(error.message));

    await launchHome(page);

    await page.getByTestId(infinityOptionTestId).click();
    const homeScreen = page.getByTestId(HomeScreenSelectors.Root);
    await expect(homeScreen.getByText('World-record puzzles', { exact: true })).toBeVisible();

    // Regression guard: selecting Infinity re-renders the shimmering start button, which
    // previously crashed react-native-web's Reanimated bridge (see home-screen-start-button-shimmer.tsx).
    expect(pageErrors).toEqual([]);

    await page.getByTestId(HomeScreenSelectors.StartButton).click();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible({ timeout: gameScreenTimeoutMilliseconds });
    await expect(page.getByTestId(GameScreenSelectors.Level)).toHaveText('Infinity');
    await expect(page.getByTestId(GameScreenSelectors.Rating)).toBeVisible();

    await page.getByTestId(GameScreenSelectors.Rating).click();
    const ratingExplainer = page.getByTestId(RatingExplainerSelectors.Root);
    await expect(ratingExplainer).toBeVisible();
    // "Beyond the ceiling" names both the current-rating row and its highlighted row in the band
    // list below, so this checks the current-rating copy specifically: the first match in DOM order.
    await expect(ratingExplainer.getByText('Beyond the ceiling', { exact: true }).first()).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(ratingExplainer).not.toBeVisible();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible();

    expect(pageErrors).toEqual([]);

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
