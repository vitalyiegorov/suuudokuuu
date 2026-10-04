import { expect, test } from '@playwright/test';
import {
    GameScreenSelectors,
    HintButtonSelectors,
    HintPanelSelectors,
    HintStepNarrationSelectors,
    SharedScreenSelectors
} from '@suuudokuuu/app/src/selectors';

import { pointingPairHintSharedPuzzleEncodedConstant } from '../src/constants/shared-challenge-links.constant';
import { launchHome } from '../src/utils/launch-home.util';
import { openSharedPuzzle } from '../src/utils/open-shared-puzzle.util';
import { startNewGame } from '../src/utils/start-new-game.util';
import { cellTestId } from '../src/utils/test-id.util';

const gameScreenTimeoutMilliseconds = 15000;

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

test('chains a pointing pair into the hidden single it enables and places the digit on apply', async ({ page }) => {
    await launchHome(page);
    await openSharedPuzzle(page, pointingPairHintSharedPuzzleEncodedConstant);
    await page.getByTestId(SharedScreenSelectors.ConfirmButton).click();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible({ timeout: gameScreenTimeoutMilliseconds });

    const hintPanel = page.getByTestId(HintPanelSelectors.Root);
    const progress = page.getByTestId(HintPanelSelectors.Progress);
    const technique = page.getByTestId(HintStepNarrationSelectors.Technique);
    const nextButton = page.getByTestId(HintPanelSelectors.NextButton);

    await page.getByTestId(HintButtonSelectors.Root).click();

    await expect(progress).toHaveAttribute('aria-label', 'Step 1 of 4');
    await expect(technique).toHaveText('Pointing Pair');
    await expect(page.getByTestId(HintStepNarrationSelectors.Value)).toHaveText('4');

    await nextButton.click();
    await expect(technique).toHaveText('Pointing Pair');

    await nextButton.click();
    await expect(progress).toHaveAttribute('aria-label', 'Step 3 of 4');
    await expect(technique).toHaveText('Hidden Single');

    await page.getByTestId(HintPanelSelectors.ApplyButton).click();
    await expect(hintPanel).not.toBeVisible();
    await expect(page.getByTestId(cellTestId(2, 1))).toHaveAttribute('aria-label', 'Row 3, column 2, 4');

    await page.getByTestId(HintButtonSelectors.Root).click();
    await expect(progress).toHaveAttribute('aria-label', 'Step 1 of 2');
    await expect(technique).toHaveText('Hidden Single');
    await expect(page.getByTestId(HintStepNarrationSelectors.Value)).toHaveText('8');
});
