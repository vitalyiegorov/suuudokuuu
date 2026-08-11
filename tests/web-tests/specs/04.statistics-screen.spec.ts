import { expect, test } from '@playwright/test';
import {
    ChallengeResultFooterSelectors,
    CompletedGameItemSelectors,
    HeaderBackButtonSelectors,
    HistoryDifficultySelectors,
    HistoryGamesScreenSelectors,
    HistoryRatingBandsSelectors,
    HistoryScreenSelectors,
    HistoryTechniquesSelectors,
    HomeScreenSelectors,
    RatingBadgeSelectors,
    ReplayActionsSelectors,
    ReplayControlsSelectors,
    ReplayHardestMomentSelectors,
    ReplayHeaderSelectors,
    ReplayMoveQualityStripSelectors,
    ReplayPaceMetricsSelectors,
    ReplayRunReviewSelectors,
    ReplayScrubberSelectors,
    ReplayShareActionSelectors
} from '@suuudokuuu/app/src/selectors';

import {
    ratedWinningSharedChallengeEncodedConstant,
    winningSharedChallengeEncodedConstant
} from '../src/constants/shared-challenge-links.constant';
import { completeWinningSharedChallenge } from '../src/utils/complete-winning-shared-challenge.util';
import { launchHome } from '../src/utils/launch-home.util';
import { getVisibleByTestId } from '../src/utils/visible-locator.util';

const newbieDifficultyCardTestId = `${HistoryDifficultySelectors.Card}.Newbie`;
const noRatingSuffixPattern = /^[^·]*$/u;

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
    // This legacy fixture predates the rating trailer and decodes with an unknown rating, so its
    // own completed-game row must show the plain difficulty text with no "· rating" suffix.
    await expect(historyGamesScreen.getByTestId(CompletedGameItemSelectors.DifficultyValue)).toHaveText(noRatingSuffixPattern);

    await page.getByTestId(CompletedGameItemSelectors.ReplayButton).click();
    await expect(page.getByTestId(ReplayControlsSelectors.Root)).toBeVisible();
    await expect(page.getByTestId(ReplayHeaderSelectors.Level)).toHaveText(noRatingSuffixPattern);

    const gameReviewCard = page.getByTestId(ReplayRunReviewSelectors.Root);
    await expect(gameReviewCard).toBeVisible();
    await expect(gameReviewCard.getByTestId(ReplayPaceMetricsSelectors.Root)).toBeVisible();
    await expect(gameReviewCard.getByTestId(HistoryTechniquesSelectors.Root)).toBeVisible();
    await expect(page.getByTestId(ReplayMoveQualityStripSelectors.Root)).toBeVisible();

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

    const hardestMomentChip = page.getByTestId(ReplayHardestMomentSelectors.Root);
    await expect(hardestMomentChip).toBeVisible();
    await hardestMomentChip.click();
    await expect(scrubber).toHaveAttribute('aria-valuenow', '1');

    await expect(page.getByTestId(ReplayShareActionSelectors.Button)).toBeVisible();

    await page.getByTestId(ReplayActionsSelectors.BackButton).click();
    await expect(page.getByTestId(HistoryGamesScreenSelectors.Root)).toBeVisible();

    await getVisibleByTestId(page, HeaderBackButtonSelectors.Root).click();
    await expect(page.getByTestId(HistoryScreenSelectors.Root)).toBeVisible();

    await getVisibleByTestId(page, HeaderBackButtonSelectors.Root).click();
    await expect(page.getByTestId(HomeScreenSelectors.Root)).toBeVisible();
});

test('shows the hardest-solve card, SE band histogram, and best-technique hero for a rated completed game', async ({ page }) => {
    await launchHome(page);
    await completeWinningSharedChallenge(page, ratedWinningSharedChallengeEncodedConstant);

    await page.getByTestId(ChallengeResultFooterSelectors.HomeButton).scrollIntoViewIfNeeded();
    await page.getByTestId(ChallengeResultFooterSelectors.HomeButton).click();
    await expect(page.getByTestId(HomeScreenSelectors.Root)).toBeVisible();

    await page.getByText('Stats').click();
    const historyScreen = page.getByTestId(HistoryScreenSelectors.Root);
    await expect(historyScreen).toBeVisible();

    // "Hardest solve" also labels the per-difficulty card's own hardest-solve metric further down
    // this screen, so this checks the totals card's copy specifically: the first match in DOM order.
    await expect(historyScreen.getByText('Hardest solve', { exact: true }).first()).toBeVisible();
    await expect(historyScreen.getByTestId(RatingBadgeSelectors.Root).first()).toBeVisible();
    await expect(historyScreen.getByTestId(HistoryRatingBandsSelectors.Root)).toBeVisible();

    const techniquesSection = historyScreen.getByTestId(HistoryTechniquesSelectors.Root);
    await expect(techniquesSection).toBeVisible();
    await expect(techniquesSection.getByText('Best technique', { exact: true })).toBeVisible();

    await page.getByTestId(newbieDifficultyCardTestId).click();
    const historyGamesScreen = page.getByTestId(HistoryGamesScreenSelectors.Root);
    await expect(historyGamesScreen).toBeVisible();
    // The rated completed-game row now composes its rating into the difficulty text instead of
    // rendering a separate badge next to it.
    await expect(historyGamesScreen.getByTestId(CompletedGameItemSelectors.DifficultyValue)).not.toHaveText(noRatingSuffixPattern);
});
