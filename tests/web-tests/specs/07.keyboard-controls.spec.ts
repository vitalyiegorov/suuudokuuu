import { expect, test } from '@playwright/test';
import { CandidateInputItemSelectors, ChallengeResultScreenSelectors, GameScreenSelectors } from '@suuudokuuu/app/src/selectors';

import {
    losingSharedChallengeEncodedConstant,
    winningSharedChallengeEncodedConstant
} from '../src/constants/shared-challenge-links.constant';
import { acceptSharedChallenge } from '../src/utils/accept-shared-challenge.util';
import { launchHome } from '../src/utils/launch-home.util';
import { openSharedChallenge } from '../src/utils/open-shared-challenge.util';
import { startNewGame } from '../src/utils/start-new-game.util';
import { cellTestId, valueButtonTestId } from '../src/utils/test-id.util';

const winningChallengeResultTimeoutMilliseconds = 5000;
const wrongCellY = 0;
const wrongCellX = 4;

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

test('toggles pencil mode with Space and the N key, and marks a pencil candidate with Shift+Digit without switching modes', async ({
    page
}) => {
    await launchHome(page);
    await openSharedChallenge(page, losingSharedChallengeEncodedConstant);
    await acceptSharedChallenge(page);

    await page.getByTestId(cellTestId(wrongCellY, wrongCellX)).click();

    await expect(page.getByTestId(valueButtonTestId(5))).toBeVisible();

    await page.keyboard.press('Space');
    await expect(page.getByTestId(`${CandidateInputItemSelectors.Button}.5`)).toBeVisible();

    await page.keyboard.press('Space');
    await expect(page.getByTestId(valueButtonTestId(5))).toBeVisible();

    await page.keyboard.press('n');
    await expect(page.getByTestId(`${CandidateInputItemSelectors.Button}.5`)).toBeVisible();

    await page.keyboard.press('n');
    await expect(page.getByTestId(valueButtonTestId(5))).toBeVisible();

    await page.keyboard.press('Shift+5');

    await expect(page.getByText('0/3')).toBeVisible();
    await expect(page.getByTestId(valueButtonTestId(5))).toBeVisible();

    await page.keyboard.press('Space');

    const markedCandidate = page.getByTestId(`${CandidateInputItemSelectors.Button}.5`);
    const unmarkedCandidate = page.getByTestId(`${CandidateInputItemSelectors.Button}.6`);
    await expect(markedCandidate).toBeVisible();

    const markedColor = await markedCandidate.evaluate(element => getComputedStyle(element).backgroundColor);
    const unmarkedColor = await unmarkedCandidate.evaluate(element => getComputedStyle(element).backgroundColor);

    expect(markedColor).not.toBe(unmarkedColor);
});

test('toggles auto-candidates with the A key', async ({ page }) => {
    await launchHome(page);
    await openSharedChallenge(page, losingSharedChallengeEncodedConstant);
    await acceptSharedChallenge(page);

    await page.getByTestId(cellTestId(wrongCellY, wrongCellX)).click();

    const tipsButton = page.getByTestId(GameScreenSelectors.TipsButton);
    const initialColor = await tipsButton.evaluate(element => getComputedStyle(element).backgroundColor);

    await page.keyboard.press('a');
    await expect.poll(() => tipsButton.evaluate(element => getComputedStyle(element).backgroundColor)).not.toBe(initialColor);

    await page.keyboard.press('a');
    await expect.poll(() => tipsButton.evaluate(element => getComputedStyle(element).backgroundColor)).toBe(initialColor);
});

test('keeps the root game screen out of the tab order so Tab and Space never outline the whole viewport', async ({ page }) => {
    await launchHome(page);
    await startNewGame(page);

    const root = page.getByTestId(GameScreenSelectors.Root);
    await expect(root).toHaveAttribute('tabindex', '-1');
    await expect(root).toHaveCSS('outline-style', 'none');

    await page.keyboard.press('Tab');

    const focusedTestId = await page.evaluate(() => document.activeElement?.getAttribute('data-testid') ?? '');
    expect(focusedTestId).not.toBe(GameScreenSelectors.Root);

    const scrollYBeforeSpace = await page.evaluate(() => window.scrollY);
    await page.keyboard.press('Space');
    const scrollYAfterSpace = await page.evaluate(() => window.scrollY);

    expect(scrollYAfterSpace).toBe(scrollYBeforeSpace);
    await expect(root).toHaveCSS('outline-style', 'none');
});
