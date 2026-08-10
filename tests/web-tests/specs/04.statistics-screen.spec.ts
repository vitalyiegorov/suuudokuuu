import { expect, test } from '@playwright/test';
import {
    ChallengeResultFooterSelectors,
    CompletedGameItemSelectors,
    HeaderBackButtonSelectors,
    HistoryDifficultySelectors,
    HistoryGamesScreenSelectors,
    HistoryScreenSelectors,
    HomeScreenSelectors,
    RatingBadgeSelectors,
    ReplayActionsSelectors,
    ReplayControlsSelectors,
    ReplayHeaderSelectors,
    ReplayScrubberSelectors,
    ReplayShareActionSelectors
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
    await expect(page.getByTestId(RatingBadgeSelectors.Root)).toHaveCount(0);

    await page.getByTestId(CompletedGameItemSelectors.ReplayButton).click();
    await expect(page.getByTestId(ReplayControlsSelectors.Root)).toBeVisible();
    await expect(page.getByTestId(ReplayHeaderSelectors.Rating)).toHaveCount(0);
    await page.getByTestId(ReplayControlsSelectors.NextButton).click();
    await page.getByTestId(ReplayControlsSelectors.PreviousButton).click();

    const scrubber = page.getByTestId(ReplayScrubberSelectors.Root);
    await expect(scrubber).toHaveAttribute('aria-valuenow', '0');

    const scrubberBox = await scrubber.boundingBox();
    if (scrubberBox === null) {
        throw new Error('Replay scrubber has no bounding box');
    }

    await scrubber.click({ position: { x: scrubberBox.width - 1, y: scrubberBox.height / 2 } });
    await expect(scrubber).toHaveAttribute('aria-valuenow', '1');

    await page.mouse.move(scrubberBox.x + scrubberBox.width - 1, scrubberBox.y + scrubberBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(scrubberBox.x + 1, scrubberBox.y + scrubberBox.height / 2, { steps: 5 });
    await page.mouse.up();
    await expect(scrubber).toHaveAttribute('aria-valuenow', '0');

    await expect(page.getByTestId(ReplayShareActionSelectors.Button)).toBeVisible();

    await page.getByTestId(ReplayActionsSelectors.BackButton).click();
    await expect(page.getByTestId(HistoryGamesScreenSelectors.Root)).toBeVisible();

    await getVisibleByTestId(page, HeaderBackButtonSelectors.Root).click();
    await expect(page.getByTestId(HistoryScreenSelectors.Root)).toBeVisible();

    await getVisibleByTestId(page, HeaderBackButtonSelectors.Root).click();
    await expect(page.getByTestId(HomeScreenSelectors.Root)).toBeVisible();
});
