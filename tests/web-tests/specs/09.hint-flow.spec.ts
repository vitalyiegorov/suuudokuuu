import { expect, test } from '@playwright/test';
import {
    FieldWitnessOverlaySelectors,
    GameScreenSelectors,
    HintButtonSelectors,
    HintPanelSelectors,
    HintStepNarrationSelectors,
    SharedScreenSelectors
} from '@suuudokuuu/app/src/selectors';

import {
    pointingPairHintSharedPuzzleEncodedConstant,
    revealHintSharedPuzzleEncodedConstant,
    structuredChainHintSharedPuzzleEncodedConstant
} from '../src/constants/shared-challenge-links.constant';
import { launchHome } from '../src/utils/launch-home.util';
import { openSharedPuzzle } from '../src/utils/open-shared-puzzle.util';
import { startNewGame } from '../src/utils/start-new-game.util';
import { cellTestId } from '../src/utils/test-id.util';

const gameScreenTimeoutMilliseconds = 15000;
const longHintTimeoutMilliseconds = 120000;

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
    const nextButton = page.getByTestId(HintPanelSelectors.NextButton);

    await nextButton.click();
    await expect(progress).toHaveAttribute('aria-label', /Step 2 of \d+/u);

    await page.getByTestId(HintPanelSelectors.BackButton).click();
    await expect(progress).toHaveAttribute('aria-label', /Step 1 of \d+/u);

    const stepCount = Number(/of (?<count>\d+)$/u.exec((await progress.getAttribute('aria-label')) ?? '')?.groups?.['count']);

    for (let step = 1; step < stepCount; step += 1) {
        await nextButton.click();
        await expect(progress).toHaveAttribute('aria-label', `Step ${step + 1} of ${stepCount}`);
    }

    const hintedDigit = await page.getByTestId(HintStepNarrationSelectors.Value).textContent();

    expect(hintedDigit).toMatch(/^[1-9]$/u);

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
    await expect(page.getByTestId(HintStepNarrationSelectors.Value)).toHaveCount(0);

    await nextButton.click();
    await expect(technique).toHaveText('Pointing Pair');

    await nextButton.click();
    await expect(progress).toHaveAttribute('aria-label', 'Step 3 of 4');
    await expect(technique).toHaveText('Hidden Single');
    await expect(page.getByTestId(HintStepNarrationSelectors.Value)).toHaveText('4');

    await page.getByTestId(HintPanelSelectors.ApplyButton).click();
    await expect(hintPanel).not.toBeVisible();
    await expect(page.getByTestId(cellTestId(2, 1))).toHaveAttribute('aria-label', 'Row 3, column 2, 4');

    await page.getByTestId(HintButtonSelectors.Root).click();
    await expect(progress).toHaveAttribute('aria-label', 'Step 1 of 2');
    await expect(technique).toHaveText('Hidden Single');
    await expect(page.getByTestId(HintStepNarrationSelectors.Value)).toHaveText('8');
});

test('reveals one digit from the solution when no short chain reaches a placement', async ({ page }) => {
    await launchHome(page);
    await openSharedPuzzle(page, revealHintSharedPuzzleEncodedConstant);
    await page.getByTestId(SharedScreenSelectors.ConfirmButton).click();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible({ timeout: gameScreenTimeoutMilliseconds });

    const progress = page.getByTestId(HintPanelSelectors.Progress);

    await page.getByTestId(HintButtonSelectors.Root).click();

    await expect(progress).toHaveAttribute('aria-label', 'Step 1 of 2');
    await expect(page.getByTestId(HintStepNarrationSelectors.Technique)).toHaveText('Reveal');

    await page.getByTestId(HintPanelSelectors.NextButton).click();
    await expect(progress).toHaveAttribute('aria-label', 'Step 2 of 2');
    await expect(page.getByTestId(HintStepNarrationSelectors.Value)).toHaveText('9');

    await page.getByTestId(HintPanelSelectors.ApplyButton).click();
    await expect(page.getByTestId(HintPanelSelectors.Root)).not.toBeVisible();
    await expect(page.getByTestId(cellTestId(7, 6))).toHaveAttribute('aria-label', 'Row 8, column 7, 9');
});

test('walks a long Nishio and AIC hint with witness slides that leave the board untouched', async ({ page }) => {
    test.setTimeout(longHintTimeoutMilliseconds);
    await launchHome(page);
    await openSharedPuzzle(page, structuredChainHintSharedPuzzleEncodedConstant);
    await page.getByTestId(SharedScreenSelectors.ConfirmButton).click();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible({ timeout: gameScreenTimeoutMilliseconds });

    const hint = page.getByTestId(HintButtonSelectors.Root);
    const apply = page.getByTestId(HintPanelSelectors.ApplyButton);
    const progress = page.getByTestId(HintPanelSelectors.Progress);
    const next = page.getByTestId(HintPanelSelectors.NextButton);
    const back = page.getByTestId(HintPanelSelectors.BackButton);

    for (let hintIndex = 0; hintIndex < 2; hintIndex += 1) {
        await hint.click();
        await apply.click();
        await expect(page.getByTestId(HintPanelSelectors.Root)).not.toBeVisible();
    }

    const labelsBefore = await readCellLabels(page);

    await hint.click();

    const progressLabel = (await progress.getAttribute('aria-label')) ?? '';
    const stepCount = Number(/of (?<count>\d+)$/u.exec(progressLabel)?.groups?.['count']);

    expect(stepCount).toBeGreaterThan(9);
    await expect(progress).toContainText(progressLabel);

    const branch = page.getByTestId(FieldWitnessOverlaySelectors.Branch);
    const outcome = page.getByTestId(FieldWitnessOverlaySelectors.Outcome);
    const techniqueNames = new Set<string>();
    let sawBranch = false;
    let sawOutcome = false;

    for (let stepIndex = 0; stepIndex < stepCount; stepIndex += 1) {
        techniqueNames.add((await page.getByTestId(HintStepNarrationSelectors.Technique).textContent()) ?? '');

        if (!sawBranch && (await branch.count())) {
            sawBranch = true;
            expect(await readCellLabels(page)).toEqual(labelsBefore);
        }

        if (!sawOutcome && (await outcome.count())) {
            sawOutcome = true;
            await back.click();
            await expect(outcome).toHaveCount(0);
            expect(await readCellLabels(page)).toEqual(labelsBefore);
            await next.click();
            await expect(outcome).not.toHaveCount(0);
        }

        if (stepIndex < stepCount - 1) {
            await next.click();
            await expect(progress).toHaveAttribute('aria-label', `Step ${stepIndex + 2} of ${stepCount}`);
        }
    }

    expect(sawBranch).toBe(true);
    expect(sawOutcome).toBe(true);
    expect(techniqueNames.has('Nishio Forcing Chain')).toBe(true);
    expect(techniqueNames.has('AIC')).toBe(true);

    await apply.click();
    await expect(page.getByTestId(cellTestId(5, 8))).toHaveAttribute('aria-label', 'Row 6, column 9, 1');
});
