import { expect, test } from '@playwright/test';
import {
    ChallengeRaceHudSelectors,
    ChallengeResultScreenSelectors,
    ChallengeTryAgainButtonSelectors,
    CompletedGameTechniqueSummarySelectors,
    GameScreenSelectors,
    LoserScreenSelectors,
    SharedScreenSelectors
} from '@suuudokuuu/app/src/selectors';

import {
    losingSharedChallengeEncodedConstant,
    ratedLosingSharedChallengeEncodedConstant,
    revealHintSharedPuzzleEncodedConstant
} from '../src/constants/shared-challenge-links.constant';
import { acceptSharedChallenge } from '../src/utils/accept-shared-challenge.util';
import { launchHome } from '../src/utils/launch-home.util';
import { openSharedChallenge } from '../src/utils/open-shared-challenge.util';
import { openSharedPuzzle } from '../src/utils/open-shared-puzzle.util';
import { quitCurrentGame } from '../src/utils/quit-current-game.util';
import { cellTestId, valueButtonTestId } from '../src/utils/test-id.util';

const wrongCellY = 0;
const wrongCellX = 4;
const wrongValue = 4;
const challengeResultTimeoutMilliseconds = 5000;
const gameScreenTimeoutMilliseconds = 15000;

test('loses a shared challenge after three mistakes and tries again', async ({ page }) => {
    await launchHome(page);
    await openSharedChallenge(page, losingSharedChallengeEncodedConstant);
    await acceptSharedChallenge(page);

    await expect(page.getByTestId(ChallengeRaceHudSelectors.Root)).toBeVisible();
    await expect(page.getByText('0/3')).toBeVisible();

    const wrongCell = page.getByTestId(cellTestId(wrongCellY, wrongCellX));
    const wrongValueButton = page.getByTestId(valueButtonTestId(wrongValue));

    await wrongCell.click();
    await wrongValueButton.click();
    await expect(page.getByText('1/3')).toBeVisible();

    await wrongValueButton.click();
    await expect(page.getByText('2/3')).toBeVisible();

    await wrongValueButton.click();
    await expect(page.getByTestId(ChallengeResultScreenSelectors.Root)).toBeVisible({ timeout: challengeResultTimeoutMilliseconds });

    await expect(page.getByTestId(ChallengeResultScreenSelectors.YourTimeValue)).toBeVisible();
    await expect(page.getByTestId(ChallengeResultScreenSelectors.OpponentTimeValue)).toBeVisible();
    await expect(page.getByText(/Out of mistakes/u).first()).toBeVisible();
    await expect(page.getByText('Did not finish the board')).toBeVisible();

    await page.getByTestId(ChallengeTryAgainButtonSelectors.Root).click();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible();

    await quitCurrentGame(page);
});

test('shows the rival rating inline on a rated challenge loss', async ({ page }) => {
    await launchHome(page);
    await openSharedChallenge(page, ratedLosingSharedChallengeEncodedConstant);
    await acceptSharedChallenge(page);

    const wrongCell = page.getByTestId(cellTestId(wrongCellY, wrongCellX));
    const wrongValueButton = page.getByTestId(valueButtonTestId(wrongValue));

    await wrongCell.click();
    await wrongValueButton.click();
    await wrongValueButton.click();
    await wrongValueButton.click();

    const resultScreen = page.getByTestId(ChallengeResultScreenSelectors.Root);
    await expect(resultScreen).toBeVisible({ timeout: challengeResultTimeoutMilliseconds });
    await expect(resultScreen.getByTestId(ChallengeResultScreenSelectors.OutcomeValue)).toHaveText(/· \d+\.\d\+?/u);

    await page.getByTestId(ChallengeTryAgainButtonSelectors.Root).click();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible();

    await quitCurrentGame(page);
});

test('shows the techniques used on the loser screen of a lost puzzle', async ({ page }) => {
    await launchHome(page);
    await openSharedPuzzle(page, revealHintSharedPuzzleEncodedConstant);
    await page.getByTestId(SharedScreenSelectors.ConfirmButton).click();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible({ timeout: gameScreenTimeoutMilliseconds });

    await page.getByTestId(cellTestId(0, 1)).click();
    await page.getByTestId(valueButtonTestId(1)).click();

    const wrongValueButton = page.getByTestId(valueButtonTestId(wrongValue));

    await page.getByTestId(cellTestId(0, 2)).click();
    await wrongValueButton.click();
    await wrongValueButton.click();
    await wrongValueButton.click();

    await expect(page.getByTestId(LoserScreenSelectors.Root)).toBeVisible({ timeout: challengeResultTimeoutMilliseconds });
    await expect(page.getByTestId(CompletedGameTechniqueSummarySelectors.Root)).toBeVisible();
});
