import { expect, test } from '@playwright/test';
import {
    DifficultyComplexityOptionSelectors,
    GameScreenSelectors,
    HomeScreenSelectors,
    PauseScreenSelectors,
    SharedScreenSelectors
} from '@suuudokuuu/app/src/selectors';

import { infinitySharedPuzzleEncodedConstant } from '../src/constants/shared-challenge-links.constant';
import { bringAppToForeground } from '../src/utils/bring-app-to-foreground.util';
import { launchHome } from '../src/utils/launch-home.util';
import { openSharedPuzzle } from '../src/utils/open-shared-puzzle.util';
import { quitPausedGame } from '../src/utils/quit-paused-game.util';
import { sendAppToBackground } from '../src/utils/send-app-to-background.util';

const gameScreenTimeoutMilliseconds = 15000;
const pauseScreenTimeoutMilliseconds = 10000;
const infinityOptionTestId = `${DifficultyComplexityOptionSelectors.Option}.Infinity`;

// The level+rating pill was removed from the game screen entirely (it now only shows on the
// pause screen and result/history surfaces), so these specs pause the run to observe it. That
// also means the rating explainer, which used to be reachable by pressing the game screen's
// rating badge, is no longer reachable from the in-game flow at all: the pause screen's pill is
// plain text, and the explainer stays reachable only from the Stats screen's hardest-solve hero.

test('starts a curated Infinity puzzle from the home screen with its rating visible on pause', async ({ page }) => {
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

    await sendAppToBackground(page);
    await expect(page.getByTestId(PauseScreenSelectors.Root)).toBeVisible({ timeout: pauseScreenTimeoutMilliseconds });
    await bringAppToForeground(page);

    // Curated Infinity puzzles carry an exact SE rating (occasionally beyond the display
    // ceiling, which adds a "+" suffix), so the exact number and ceiling suffix vary with the
    // puzzle drawn.
    await expect(page.getByTestId(PauseScreenSelectors.DetailsValue)).toHaveText(/Infinity · \d+\.\d\+? • /u);

    expect(pageErrors).toEqual([]);

    await quitPausedGame(page);
});

test('round-trips a shared Infinity link end to end with its rating carried onto the pause screen', async ({ page }) => {
    await launchHome(page);
    await openSharedPuzzle(page, infinitySharedPuzzleEncodedConstant);

    const meta = page.getByTestId(SharedScreenSelectors.Meta);
    await expect(meta.getByText('Infinity · 11.9', { exact: true })).toBeVisible();

    await page.getByTestId(SharedScreenSelectors.ConfirmButton).click();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible({ timeout: gameScreenTimeoutMilliseconds });

    await sendAppToBackground(page);
    await expect(page.getByTestId(PauseScreenSelectors.Root)).toBeVisible({ timeout: pauseScreenTimeoutMilliseconds });
    await bringAppToForeground(page);
    await expect(page.getByTestId(PauseScreenSelectors.DetailsValue)).toHaveText(/Infinity · 11\.9/u);

    await quitPausedGame(page);
});
