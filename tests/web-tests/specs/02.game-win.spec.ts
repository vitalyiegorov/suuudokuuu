import { expect, test } from '@playwright/test';
import { ChallengeResultFooterSelectors, ChallengeResultScreenSelectors, HomeScreenSelectors } from '@suuudokuuu/app/src/selectors';

import {
    ratedWinningSharedChallengeEncodedConstant,
    winningSharedChallengeEncodedConstant
} from '../src/constants/shared-challenge-links.constant';
import { completeWinningSharedChallenge } from '../src/utils/complete-winning-shared-challenge.util';
import { launchHome } from '../src/utils/launch-home.util';

test('wins a shared challenge and returns home from the result screen', async ({ page }) => {
    await launchHome(page);
    await completeWinningSharedChallenge(page, winningSharedChallengeEncodedConstant);

    await expect(page.getByTestId(ChallengeResultScreenSelectors.YourTimeValue)).toBeVisible();
    await expect(page.getByTestId(ChallengeResultScreenSelectors.OpponentTimeValue)).toBeVisible();
    await expect(page.getByText(/You beat your rival/u)).toBeVisible();
    await expect(page.getByTestId(ChallengeResultScreenSelectors.MarginValue)).toBeVisible();

    await page.getByTestId(ChallengeResultScreenSelectors.UkraineSupportCta).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(ChallengeResultScreenSelectors.UkraineSupportCta)).toBeVisible();

    await page.getByTestId(ChallengeResultFooterSelectors.HomeButton).click();
    await expect(page.getByTestId(HomeScreenSelectors.Root)).toBeVisible();
});

test('shows the rival rating inline on a rated challenge win', async ({ page }) => {
    await launchHome(page);
    await completeWinningSharedChallenge(page, ratedWinningSharedChallengeEncodedConstant);

    const resultScreen = page.getByTestId(ChallengeResultScreenSelectors.Root);
    await expect(resultScreen.getByTestId(ChallengeResultScreenSelectors.OutcomeValue)).toHaveText(/· \d+\.\d\+?/u);
});
