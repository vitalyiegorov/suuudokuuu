import { expect, test } from '@playwright/test';
import { ChallengeResultScreenSelectors, GameScreenSelectors } from '@suuudokuuu/app/src/selectors';

import { winningSharedChallengeEncodedConstant } from '../src/constants/shared-challenge-links.constant';
import { acceptSharedChallenge } from '../src/utils/accept-shared-challenge.util';
import { launchHome } from '../src/utils/launch-home.util';
import { openSharedChallenge } from '../src/utils/open-shared-challenge.util';
import { startNewGame } from '../src/utils/start-new-game.util';

const winningChallengeResultTimeoutMilliseconds = 5000;

test('wins a shared challenge using only the keyboard', async ({ page }) => {
    await launchHome(page);
    await openSharedChallenge(page, winningSharedChallengeEncodedConstant);
    await acceptSharedChallenge(page);

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('2');

    await expect(page.getByTestId(ChallengeResultScreenSelectors.Root)).toBeVisible({
        timeout: winningChallengeResultTimeoutMilliseconds
    });
});

test('escape opens the quit confirmation instead of silently deselecting', async ({ page }) => {
    await launchHome(page);
    await startNewGame(page);

    await page.keyboard.press('ArrowDown');

    let dialogMessage = '';
    page.once('dialog', dialog => {
        dialogMessage = dialog.message();
        void dialog.dismiss();
    });
    await page.keyboard.press('Escape');

    await expect.poll(() => dialogMessage).toContain('Stop current run?');
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible();
});
