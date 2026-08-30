import { expect, test } from '@playwright/test';
import { GameScreenSelectors, HintButtonSelectors, HintPanelSelectors, HintStepNarrationSelectors } from '@suuudokuuu/app/src/selectors';

import { launchHome } from '../src/utils/launch-home.util';
import { startNewGame } from '../src/utils/start-new-game.util';

const readCellLabels = async (page: import('@playwright/test').Page): Promise<Map<string, string | null>> => {
    const labels = new Map<string, string | null>();

    for (const cell of await page.getByTestId(/^CellSelectors\.Cell\./u).all()) {
        labels.set((await cell.getAttribute('data-testid')) ?? '', await cell.getAttribute('aria-label'));
    }

    return labels;
};

const findChangedCellLabels = async (
    page: import('@playwright/test').Page,
    labelsBefore: Map<string, string | null>
): Promise<string[]> => {
    const changedLabels: string[] = [];

    for (const cell of await page.getByTestId(/^CellSelectors\.Cell\./u).all()) {
        const testId = (await cell.getAttribute('data-testid')) ?? '';
        const label = await cell.getAttribute('aria-label');

        if (labelsBefore.get(testId) !== label) {
            changedLabels.push(label ?? '');
        }
    }

    return changedLabels;
};

test('walks a hint from activation through stepping, applying and a later dismiss', async ({ page }) => {
    await launchHome(page);
    await startNewGame(page);

    const hintPanel = page.getByTestId(HintPanelSelectors.Root);

    await page.getByTestId(HintButtonSelectors.Root).click();

    await expect(hintPanel).toBeVisible();
    await expect(page.getByTestId(HintStepNarrationSelectors.Technique)).toHaveText(/.+/u);
    await expect(page.getByTestId(HintStepNarrationSelectors.Narration)).toHaveText(/.+/u);

    const progress = page.getByTestId(HintPanelSelectors.Progress);

    await expect(progress).toHaveAttribute('aria-label', /Step 1 of \d+/u);

    const labelsBefore = await readCellLabels(page);
    const hintedDigit = await page.getByTestId(HintStepNarrationSelectors.Value).textContent();

    expect(hintedDigit).toMatch(/^[1-9]$/u);

    await page.getByTestId(HintPanelSelectors.NextButton).click();
    await expect(progress).toHaveAttribute('aria-label', /Step 2 of \d+/u);

    await page.getByTestId(HintPanelSelectors.BackButton).click();
    await expect(progress).toHaveAttribute('aria-label', /Step 1 of \d+/u);

    await page.getByTestId(HintPanelSelectors.ApplyButton).click();
    await expect(hintPanel).not.toBeVisible();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible();

    const placedCellLabelPattern = new RegExp(`^Row \\d+, column \\d+, ${hintedDigit ?? ''}$`, 'u');
    const placedLabels = (await findChangedCellLabels(page, labelsBefore)).filter(label => placedCellLabelPattern.test(label));

    expect(placedLabels).toHaveLength(1);

    await page.getByTestId(HintButtonSelectors.Root).click();
    await expect(hintPanel).toBeVisible();

    await page.getByTestId(HintPanelSelectors.DismissButton).click();
    await expect(hintPanel).not.toBeVisible();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible();
});
