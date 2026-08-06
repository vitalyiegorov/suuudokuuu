import { expect, test } from '@playwright/test';
import {
    ChallengeResultFooterSelectors,
    CompletedGameItemSelectors,
    HeaderBackButtonSelectors,
    HistoryDifficultySelectors,
    HistoryGamesScreenSelectors,
    HistoryScreenSelectors,
    HomeScreenSelectors,
    ReplayActionsSelectors,
    ReplayControlsSelectors
} from '@suuudokuuu/app/src/selectors';

import { winningSharedChallengeEncodedConstant } from '../src/constants/shared-challenge-links.constant';
import { completeWinningSharedChallenge } from '../src/utils/complete-winning-shared-challenge.util';
import { launchHome } from '../src/utils/launch-home.util';
import { getVisibleByTestId } from '../src/utils/visible-locator.util';

const newbieDifficultyCardTestId = `${HistoryDifficultySelectors.Card}.Newbie`;

test('reviews and replays a completed game from statistics', async ({ page }) => {
    await launchHome(page);
    await completeWinningSharedChallenge(page, winningSharedChallengeEncodedConstant);

    await page.getByTestId(ChallengeResultFooterSelectors.HomeButton).scrollIntoViewIfNeeded();
    await page.getByTestId(ChallengeResultFooterSelectors.HomeButton).click();
    await expect(page.getByTestId(HomeScreenSelectors.Root)).toBeVisible();

    await page.getByText('Stats').click();
    const historyScreen = page.getByTestId(HistoryScreenSelectors.Root);
    await expect(historyScreen).toBeVisible();
    await expect(historyScreen.getByText('Newbie', { exact: true })).toBeVisible();

    await page.getByTestId(newbieDifficultyCardTestId).click();
    const historyGamesScreen = page.getByTestId(HistoryGamesScreenSelectors.Root);
    await expect(historyGamesScreen).toBeVisible();
    await expect(page.getByTestId(CompletedGameItemSelectors.ReplayButton)).toBeVisible();
    await expect(historyGamesScreen.getByText('Score', { exact: true })).toBeVisible();
    await expect(historyGamesScreen.getByText('Time', { exact: true })).toBeVisible();
    await expect(historyGamesScreen.getByText('Mistakes', { exact: true })).toBeVisible();

    await page.getByTestId(CompletedGameItemSelectors.ReplayButton).click();
    await expect(page.getByTestId(ReplayControlsSelectors.Root)).toBeVisible();
    await page.getByTestId(ReplayControlsSelectors.NextButton).click();
    await page.getByTestId(ReplayControlsSelectors.PreviousButton).click();

    await page.getByTestId(ReplayActionsSelectors.BackButton).click();
    await expect(page.getByTestId(HistoryGamesScreenSelectors.Root)).toBeVisible();

    await getVisibleByTestId(page, HeaderBackButtonSelectors.Root).click();
    await expect(page.getByTestId(HistoryScreenSelectors.Root)).toBeVisible();

    await getVisibleByTestId(page, HeaderBackButtonSelectors.Root).click();
    await expect(page.getByTestId(HomeScreenSelectors.Root)).toBeVisible();
});
