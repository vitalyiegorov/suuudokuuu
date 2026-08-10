import { expect, test } from '@playwright/test';
import { GameScreenSelectors, HomeScreenSelectors } from '@suuudokuuu/app/src/selectors';

import { launchHome } from '../src/utils/launch-home.util';
import { quitCurrentGame } from '../src/utils/quit-current-game.util';
import { startNewGame } from '../src/utils/start-new-game.util';

test('starts and quits a new game from the home screen', async ({ page }) => {
    await launchHome(page);
    const homeScreen = page.getByTestId(HomeScreenSelectors.Root);
    await expect(homeScreen.getByText('Difficulty', { exact: true })).toBeVisible();
    await expect(homeScreen.getByText('Newbie', { exact: true })).toBeVisible();
    await expect(homeScreen.getByText('Mistakes', { exact: true })).toBeVisible();

    await startNewGame(page);
    await expect(page.getByTestId(GameScreenSelectors.Score)).toHaveText('0');
    await expect(page.getByText('0/3')).toBeVisible();
    await expect(page.getByTestId(GameScreenSelectors.Level)).toHaveText('Easy');
    await expect(page.getByTestId(GameScreenSelectors.Rating)).toBeVisible();

    await quitCurrentGame(page);
    await expect(page.getByTestId(HomeScreenSelectors.StartButton)).toBeVisible();
});
