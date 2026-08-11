import { expect, test } from '@playwright/test';
import { GameScreenSelectors, HintButtonSelectors, HintPanelSelectors, HintStepNarrationSelectors } from '@suuudokuuu/app/src/selectors';

import { launchHome } from '../src/utils/launch-home.util';
import { startNewGame } from '../src/utils/start-new-game.util';

test('walks a hint from activation through stepping, applying and a later dismiss', async ({ page }) => {
    await launchHome(page);
    await startNewGame(page);

    await page.getByTestId(HintButtonSelectors.Root).click();

    const hintPanel = page.getByTestId(HintPanelSelectors.Root);
    await expect(hintPanel).toBeVisible();
    await expect(page.getByTestId(HintStepNarrationSelectors.Technique)).toHaveText(/.+/u);
    await expect(page.getByTestId(HintStepNarrationSelectors.Narration)).toHaveText(/.+/u);
    await expect(page.getByTestId(HintPanelSelectors.Progress)).toHaveText(/Step 1 of \d+/u);

    await page.getByTestId(HintPanelSelectors.NextButton).click();
    await expect(page.getByTestId(HintPanelSelectors.Progress)).toHaveText(/Step 2 of \d+/u);

    await page.getByTestId(HintPanelSelectors.BackButton).click();
    await expect(page.getByTestId(HintPanelSelectors.Progress)).toHaveText(/Step 1 of \d+/u);

    await page.getByTestId(HintPanelSelectors.ApplyButton).click();
    await expect(hintPanel).not.toBeVisible();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible();

    await page.getByTestId(HintButtonSelectors.Root).click();
    await expect(hintPanel).toBeVisible();

    await page.getByTestId(HintPanelSelectors.DismissButton).click();
    await expect(hintPanel).not.toBeVisible();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible();
});
