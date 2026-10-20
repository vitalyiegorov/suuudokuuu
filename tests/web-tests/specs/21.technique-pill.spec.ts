import { expect, test } from '@playwright/test';
import { ChallengeRaceBadgeSelectors, GameScreenSelectors, SharedScreenSelectors } from '@suuudokuuu/app/src/selectors';

import { revealHintSharedPuzzleEncodedConstant } from '../src/constants/shared-challenge-links.constant';
import { launchHome } from '../src/utils/launch-home.util';
import { openSharedPuzzle } from '../src/utils/open-shared-puzzle.util';
import { cellTestId, valueButtonTestId } from '../src/utils/test-id.util';

const gameScreenTimeoutMilliseconds = 15000;

test('shows the technique pill after a correct move in a normal run', async ({ page }) => {
    await launchHome(page);
    await openSharedPuzzle(page, revealHintSharedPuzzleEncodedConstant);
    await page.getByTestId(SharedScreenSelectors.ConfirmButton).click();

    const gameScreen = page.getByTestId(GameScreenSelectors.Root);
    await expect(gameScreen).toBeVisible({ timeout: gameScreenTimeoutMilliseconds });
    await expect(gameScreen.getByTestId(ChallengeRaceBadgeSelectors.Root)).toHaveCount(0);

    await page.getByTestId(cellTestId(0, 1)).click();
    await page.getByTestId(valueButtonTestId(1)).click();

    await expect(gameScreen.getByTestId(ChallengeRaceBadgeSelectors.Root)).toBeVisible();
});
