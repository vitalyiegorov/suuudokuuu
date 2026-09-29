import { expect, test } from '@playwright/test';
import {
    ChallengeResultFooterSelectors,
    ChallengeResultScreenSelectors,
    CompletedGameItemSelectors,
    CompletedGameTechniqueSummarySelectors,
    HistoryDifficultySelectors,
    HistoryGamesScreenSelectors,
    HomeScreenSelectors,
    ReplayControlsSelectors,
    ReplayScrubberSelectors
} from '@suuudokuuu/app/src/selectors';

import { winningSharedChallengeEncodedConstant } from '../src/constants/shared-challenge-links.constant';
import { acceptSharedChallenge } from '../src/utils/accept-shared-challenge.util';
import { launchHome } from '../src/utils/launch-home.util';
import { openSharedChallengeOverGame } from '../src/utils/open-shared-challenge-over-game.util';
import { startNewGame } from '../src/utils/start-new-game.util';
import { cellTestId, valueButtonTestId } from '../src/utils/test-id.util';

test('records a challenge accepted over a live game once, with its techniques and a working replay', async ({ page }) => {
    await launchHome(page);
    await startNewGame(page);
    await openSharedChallengeOverGame(page, winningSharedChallengeEncodedConstant);
    await acceptSharedChallenge(page);

    await page.getByTestId(cellTestId(6, 0)).click();
    await page.getByTestId(valueButtonTestId(2)).click();
    await expect(page.getByTestId(ChallengeResultScreenSelectors.Root)).toBeVisible();

    await page.getByTestId(ChallengeResultFooterSelectors.HomeButton).scrollIntoViewIfNeeded();
    await page.getByTestId(ChallengeResultFooterSelectors.HomeButton).click();
    await expect(page.getByTestId(HomeScreenSelectors.Root)).toBeVisible();

    await page.getByText('Stats').click();
    await page.getByTestId(`${HistoryDifficultySelectors.Card}.Newbie`).click();
    await expect(page.getByTestId(HistoryGamesScreenSelectors.Root)).toBeVisible();
    await expect(page.getByTestId(CompletedGameItemSelectors.ReplayButton)).toHaveCount(1);
    await expect(page.getByTestId(CompletedGameTechniqueSummarySelectors.Root)).toBeVisible();

    await page.getByTestId(CompletedGameItemSelectors.ReplayButton).click();
    await expect(page.getByTestId(ReplayControlsSelectors.Root)).toBeVisible();
    await page.getByTestId(ReplayControlsSelectors.NextButton).click();
    await expect(page.getByTestId(ReplayScrubberSelectors.Root)).toHaveAttribute('aria-valuemax', '1');
    await expect(page.getByTestId(ReplayScrubberSelectors.Root)).toHaveAttribute('aria-valuenow', '1');
});
