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
    aicDetourHintSharedPuzzleEncodedConstant,
    eliminationHintSharedPuzzleEncodedConstant,
    nishioRunHintSharedPuzzleEncodedConstant,
    pointingPairHintSharedPuzzleEncodedConstant,
    revealHintSharedPuzzleEncodedConstant,
    structuredChainHintSharedPuzzleEncodedConstant
} from '../src/constants/shared-challenge-links.constant';
import { launchHome } from '../src/utils/launch-home.util';
import { openSharedPuzzle } from '../src/utils/open-shared-puzzle.util';
import { startNewGame } from '../src/utils/start-new-game.util';
import { cellTestId } from '../src/utils/test-id.util';

const mobileViewportWidth = 390;
const desktopViewportWidth = 1280;
const viewportHeight = 844;
const landscapeViewportWidth = 844;
const landscapeViewportHeight = 390;
const panelHorizontalGap = 12;
const panelBottomGap = 24;
const mobileBottomInset = 34;

const gameScreenTimeoutMilliseconds = 15000;
const longHintTimeoutMilliseconds = 120000;

const revealHintWalkthrough = async (page: import('@playwright/test').Page): Promise<void> => {
    const showMore = page.getByTestId(HintPanelSelectors.SHOW_MORE_BUTTON);

    await expect(page.getByTestId(HintPanelSelectors.ContinueButton)).toHaveCount(0);
    await expect(page.getByTestId(HintPanelSelectors.RevealButton)).toHaveCount(0);
    await showMore.click();
    await expect(page.getByTestId(HintPanelSelectors.ContinueButton)).toHaveCount(0);
    await expect(page.getByTestId(HintPanelSelectors.RevealButton)).toHaveCount(0);
    await showMore.click();
    await expect(page.getByTestId(HintPanelSelectors.Progress)).toBeVisible();
};

const applyHintEarly = async (page: import('@playwright/test').Page): Promise<void> => {
    await page.getByTestId(HintPanelSelectors.ApplyButton).or(page.getByTestId(HintPanelSelectors.ContinueButton)).click();
};

const expectHintBelowToolbar = async (page: import('@playwright/test').Page): Promise<void> => {
    const viewport = page.viewportSize();

    if (viewport === null) {
        return;
    }

    const panel = await page.getByTestId(HintPanelSelectors.Root).boundingBox();
    const hintButton = await page.getByTestId(HintButtonSelectors.Root).boundingBox();

    expect(panel).not.toBeNull();
    expect(hintButton).not.toBeNull();
    expect(panel?.y).toBeGreaterThanOrEqual((hintButton?.y ?? 0) + (hintButton?.height ?? 0));
};

const readCellLabels = async (page: import('@playwright/test').Page): Promise<Map<string, string | null>> =>
    new Map(
        await page
            .getByTestId(/^CellSelectors\.Cell\./u)
            .evaluateAll(elements =>
                elements.map((element): readonly [string, string | null] => [
                    element.getAttribute('data-testid') ?? '',
                    element.getAttribute('aria-label')
                ])
            )
    );

const findChangedCellLabels = async (
    page: import('@playwright/test').Page,
    labelsBefore: Map<string, string | null>
): Promise<string[]> => {
    const labelsAfter = await readCellLabels(page);

    return [...labelsAfter]
        .filter(([cellTestIdentifier, label]) => labelsBefore.get(cellTestIdentifier) !== label)
        .map(([, label]) => label ?? '');
};

test('walks a hint from activation through stepping, applying and a later dismiss', async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await launchHome(page);
    await startNewGame(page);

    const hintPanel = page.getByTestId(HintPanelSelectors.Root);

    await page.getByTestId(HintButtonSelectors.Root).click();

    await expect(hintPanel).toBeVisible();
    await expect(page.getByTestId(HintStepNarrationSelectors.Technique)).toHaveText(/.+/u);
    await expect(page.getByTestId(HintStepNarrationSelectors.Narration)).toHaveText(/^Look for .+ in (?:row|column|box) \d+\.$/u);
    await expect(page.getByTestId(HintStepNarrationSelectors.Narration)).toHaveAttribute('aria-live', 'polite');
    await expectHintBelowToolbar(page);
    await page.screenshot({ scale: 'css', path: testInfo.outputPath('hint-level-1-technique.png'), fullPage: true });

    const progress = page.getByTestId(HintPanelSelectors.Progress);

    await expect(progress).toHaveCount(0);
    await expect(page.getByTestId(HintPanelSelectors.ApplyButton)).toHaveCount(0);

    await page.getByTestId(HintPanelSelectors.SHOW_MORE_BUTTON).click();
    await expect(page.getByTestId(HintStepNarrationSelectors.Narration)).toHaveText(/the highlighted cells hold the pattern\.$/u);
    await expect(progress).toHaveCount(0);
    await expect(page.getByTestId(HintPanelSelectors.ApplyButton)).toHaveCount(0);
    await expectHintBelowToolbar(page);
    await page.screenshot({ scale: 'css', path: testInfo.outputPath('hint-level-2-pattern.png'), fullPage: true });

    await page.getByTestId(HintPanelSelectors.SHOW_MORE_BUTTON).click();
    await expect(page.getByTestId(HintPanelSelectors.SHOW_MORE_BUTTON)).toHaveCount(0);
    await expect(progress).toBeVisible();

    await expect(progress).toHaveAttribute('aria-label', /Step 1 of \d+/u);
    await expectHintBelowToolbar(page);
    await page.screenshot({ scale: 'css', path: testInfo.outputPath('hint-level-3-walkthrough.png'), fullPage: true });

    const labelsBefore = await readCellLabels(page);
    const nextButton = page.getByTestId(HintPanelSelectors.NextButton);

    const stepCount = Number(/of (?<count>\d+)$/u.exec((await progress.getAttribute('aria-label')) ?? '')?.groups?.['count']);

    if (stepCount > 2) {
        await nextButton.click();
        await expect(progress).toHaveAttribute('aria-label', /Step 2 of \d+/u);
        await page.getByTestId(HintPanelSelectors.BackButton).click();
        await expect(progress).toHaveAttribute('aria-label', /Step 1 of \d+/u);
    }

    for (let step = 1; step < stepCount; step += 1) {
        await nextButton.click();
        await expect(progress).toHaveAttribute('aria-label', `Step ${step + 1} of ${stepCount}`);
    }

    const hintedDigit = await page.getByTestId(HintStepNarrationSelectors.Value).textContent();

    expect(hintedDigit).toMatch(/^[1-9]$/u);

    await page.getByTestId(HintPanelSelectors.ApplyButton).click();
    await expect(hintPanel).not.toBeVisible();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible();
    await page.screenshot({ scale: 'css', path: testInfo.outputPath('hint-level-4-placement.png'), fullPage: true });

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
    await revealHintWalkthrough(page);

    await expect(progress).toHaveAttribute('aria-label', 'Step 1 of 4');
    await expect(technique).toHaveText('Pointing Pair');
    await expect(page.getByTestId(HintStepNarrationSelectors.Value)).toHaveCount(0);

    await nextButton.click();
    await expect(technique).toHaveText('Pointing Pair');

    await nextButton.click();
    await expect(progress).toHaveAttribute('aria-label', 'Step 3 of 4');
    await expect(technique).toHaveText('Hidden Single');
    await expect(page.getByTestId(HintStepNarrationSelectors.Value)).toHaveText('4');

    await applyHintEarly(page);
    await expect(hintPanel).not.toBeVisible();
    await expect(page.getByTestId(cellTestId(2, 1))).toHaveAttribute('aria-label', 'Row 3, column 2, 4');

    await page.getByTestId(HintButtonSelectors.Root).click();
    await revealHintWalkthrough(page);
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

test('starts a fresh hint at level one after continuing an elimination', async ({ page }) => {
    await launchHome(page);
    await openSharedPuzzle(page, eliminationHintSharedPuzzleEncodedConstant);
    await page.getByTestId(SharedScreenSelectors.ConfirmButton).click();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible({ timeout: gameScreenTimeoutMilliseconds });

    await page.getByTestId(HintButtonSelectors.Root).click();
    await revealHintWalkthrough(page);
    await expect(page.getByTestId(HintPanelSelectors.Progress)).toHaveAttribute('aria-label', 'Step 1 of 2');

    await page.getByTestId(HintPanelSelectors.NextButton).click();
    await page.getByTestId(HintPanelSelectors.ContinueButton).click();

    await expect(page.getByTestId(HintPanelSelectors.SHOW_MORE_BUTTON)).toBeVisible();
    await expect(page.getByTestId(HintPanelSelectors.Progress)).toHaveCount(0);
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
        await revealHintWalkthrough(page);
        await applyHintEarly(page);
        await expect(page.getByTestId(HintPanelSelectors.Root)).not.toBeVisible();
    }

    const labelsBefore = await readCellLabels(page);

    await hint.click();
    await revealHintWalkthrough(page);

    const progressLabel = (await progress.getAttribute('aria-label')) ?? '';
    const stepCount = Number(/of (?<count>\d+)$/u.exec(progressLabel)?.groups?.['count']);

    expect(stepCount).toBeGreaterThan(9);

    const branch = page.getByTestId(FieldWitnessOverlaySelectors.Branch);
    const outcome = page.getByTestId(FieldWitnessOverlaySelectors.Outcome);
    const chain = page.getByTestId(FieldWitnessOverlaySelectors.Chain);
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
            await next.click();
            await expect(outcome).not.toHaveCount(0);
        }

        if ((await chain.count()) > 0) {
            await expect(page.getByTestId(HintStepNarrationSelectors.Narration)).toHaveText('At least one end of this chain must be true.');
            await expect(page.getByTestId(HintStepNarrationSelectors.Narration)).toHaveAttribute('aria-label', /^Follow the chain .+/u);
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

test('leads the player-reported Hardcore board straight to a digit instead of capped eliminations', async ({ page }) => {
    await launchHome(page);
    await openSharedPuzzle(page, nishioRunHintSharedPuzzleEncodedConstant);
    await page.getByTestId(SharedScreenSelectors.ConfirmButton).click();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible({ timeout: gameScreenTimeoutMilliseconds });

    await page.getByTestId(HintButtonSelectors.Root).click();
    await revealHintWalkthrough(page);

    await expect(page.getByTestId(HintStepNarrationSelectors.Technique)).toHaveText('Nishio Forcing Chain');
    await expect(page.getByTestId(HintPanelSelectors.ContinueButton)).toHaveCount(0);

    await page.getByTestId(HintPanelSelectors.ApplyButton).click();
    await expect(page.getByTestId(HintPanelSelectors.Root)).not.toBeVisible();
    await expect(page.getByTestId(cellTestId(2, 0))).toHaveAttribute('aria-label', 'Row 3, column 1, 9');
});

test('routes the reported AIC board through its pointing pair to a digit and opens each slide at the top', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await launchHome(page);
    await openSharedPuzzle(page, aicDetourHintSharedPuzzleEncodedConstant);
    await page.getByTestId(SharedScreenSelectors.ConfirmButton).click();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible({ timeout: gameScreenTimeoutMilliseconds });

    const progress = page.getByTestId(HintPanelSelectors.Progress);
    const technique = page.getByTestId(HintStepNarrationSelectors.Technique);
    const narrationScroll = page.getByTestId(HintStepNarrationSelectors.NARRATION_SCROLL);
    const nextButton = page.getByTestId(HintPanelSelectors.NextButton);

    await page.getByTestId(HintButtonSelectors.Root).click();
    await revealHintWalkthrough(page);

    await expect(progress).toHaveAttribute('aria-label', 'Step 1 of 7');
    await expect(technique).toHaveText('Pointing Pair');
    await expect(page.getByTestId(HintPanelSelectors.ContinueButton)).toHaveCount(0);

    await nextButton.click();
    await nextButton.click();
    await expect(technique).toHaveText('Nishio Forcing Chain');
    await narrationScroll.evaluate(element => {
        element.scrollTop = element.scrollHeight;
    });
    expect(await narrationScroll.evaluate(element => element.scrollTop)).toBeGreaterThan(0);

    await nextButton.click();
    await expect(progress).toHaveAttribute('aria-label', 'Step 4 of 7');
    expect(await narrationScroll.evaluate(element => element.scrollTop)).toBe(0);

    for (let step = 4; step < 7; step += 1) {
        await nextButton.click();
    }

    await expect(page.getByTestId(HintStepNarrationSelectors.Value)).toHaveText('8');
    await page.getByTestId(HintPanelSelectors.ApplyButton).click();
    await expect(page.getByTestId(HintPanelSelectors.Root)).not.toBeVisible();
    await expect(page.getByTestId(cellTestId(5, 6))).toHaveAttribute('aria-label', 'Row 6, column 7, 8');
});

test('continues and reveals from the first slide of a forcing-chain elimination hint', async ({ page }, testInfo) => {
    await launchHome(page);
    await openSharedPuzzle(page, eliminationHintSharedPuzzleEncodedConstant);
    await page.getByTestId(SharedScreenSelectors.ConfirmButton).click();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible({ timeout: gameScreenTimeoutMilliseconds });

    const progress = page.getByTestId(HintPanelSelectors.Progress);
    const narration = page.getByTestId(HintStepNarrationSelectors.Narration);

    await page.getByTestId(HintButtonSelectors.Root).click();

    for (let hintIndex = 0; hintIndex < 3; hintIndex += 1) {
        await revealHintWalkthrough(page);
        await expect(progress).toHaveAttribute('aria-label', /^Step 1 of /u);
        if (hintIndex === 0) {
            await page.screenshot({ scale: 'css', path: testInfo.outputPath('hint-continue-slide-1-before.png'), fullPage: true });
        }
        await applyHintEarly(page);
    }

    await revealHintWalkthrough(page);
    await expect(progress).toHaveAttribute('aria-label', 'Step 1 of 3');
    await expect(narration).toHaveText('Contradiction, so R7C3 is not 9.');
    await expect(narration).toHaveAttribute('aria-label', /So r7c3 is not 9\./u);

    await expect(page.getByTestId(HintPanelSelectors.ApplyButton)).toHaveCount(0);
    const labelsBefore = await readCellLabels(page);

    await applyHintEarly(page);
    expect(await readCellLabels(page)).toEqual(labelsBefore);
    await expect(page.getByTestId(HintPanelSelectors.SHOW_MORE_BUTTON)).toBeVisible();
    await revealHintWalkthrough(page);
    await expect(narration).not.toHaveAttribute('aria-label', /So r7c3 is not 9\./u);
    await expect(progress).toHaveAttribute('aria-label', /^Step 1 of /u);
    await page.screenshot({ scale: 'css', path: testInfo.outputPath('hint-continue-slide-1-after.png'), fullPage: true });

    await page.getByTestId(HintPanelSelectors.RevealButton).click();
    await expect(page.getByTestId(HintStepNarrationSelectors.Technique)).toHaveText('Reveal');
    await page.screenshot({ scale: 'css', path: testInfo.outputPath('hint-reveal-slide-1-after.png'), fullPage: true });
});

for (const viewport of [
    { width: mobileViewportWidth, height: viewportHeight },
    { width: desktopViewportWidth, height: viewportHeight },
    { width: landscapeViewportWidth, height: landscapeViewportHeight }
]) {
    const { width, height } = viewport;
    test(`renders structured chain blocks inside the safe-area gap at ${width}px`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await launchHome(page);
        await openSharedPuzzle(page, structuredChainHintSharedPuzzleEncodedConstant);
        await page.getByTestId(SharedScreenSelectors.ConfirmButton).click();
        await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible({ timeout: gameScreenTimeoutMilliseconds });

        for (let hintIndex = 0; hintIndex < 2; hintIndex += 1) {
            await page.getByTestId(HintButtonSelectors.Root).click();
            await revealHintWalkthrough(page);
            await applyHintEarly(page);
        }

        await page.getByTestId(HintButtonSelectors.Root).click();
        await revealHintWalkthrough(page);
        const branch = page.getByTestId(FieldWitnessOverlaySelectors.Branch);

        const progress = page.getByTestId(HintPanelSelectors.Progress);
        const stepCount = Number(/of (?<count>\d+)$/u.exec((await progress.getAttribute('aria-label')) ?? '')?.groups?.['count']);

        for (let stepIndex = 1; stepIndex < stepCount && (await branch.count()) === 0; stepIndex += 1) {
            await page.getByTestId(HintPanelSelectors.NextButton).click();
        }

        await expect(branch).not.toHaveCount(0);
        await expect(page.getByTestId(HintStepNarrationSelectors.Narration)).toHaveText('Contradiction, so R8C4 is not 6.');
        await expect(page.getByTestId(HintStepNarrationSelectors.Narration)).toHaveAttribute(
            'aria-label',
            /If r8c4=6 → r9c4=7 → .+So r8c4 is not 6\./u
        );

        await page.screenshot({ scale: 'css', path: `../../.scratch/short-narration-hint-chain-${width}.png` });
        await expect(page.getByTestId(HintStepNarrationSelectors.CHAIN_BLOCKS)).toBeVisible();
        await expect(page.getByTestId(HintStepNarrationSelectors.CHAIN_BLOCKS)).toContainText(/R\dC\d = \d/u);

        const narrationScroll = page.getByTestId(HintStepNarrationSelectors.NARRATION_SCROLL);
        const chainBlocks = page.getByTestId(HintStepNarrationSelectors.CHAIN_BLOCKS);
        if (width === mobileViewportWidth) {
            await expect(chainBlocks).toBeInViewport({ ratio: 1 });
        }

        await page.getByTestId(HintStepNarrationSelectors.Narration).scrollIntoViewIfNeeded();
        await expect(page.getByTestId(HintStepNarrationSelectors.Narration)).toBeVisible();
        await narrationScroll.evaluate(element => {
            element.scrollTop = 0;
        });
        await page.getByTestId(HintStepNarrationSelectors.CONTRADICTION).last().scrollIntoViewIfNeeded();
        const finalCandidate = chainBlocks.getByText(/^R\dC\d = \d$/u).last();
        await finalCandidate.scrollIntoViewIfNeeded();
        await expect(finalCandidate).toBeInViewport({ ratio: 1 });
        await expect(page.getByTestId(HintStepNarrationSelectors.Narration)).toBeInViewport({ ratio: 1 });
        await expect(page.getByTestId(HintStepNarrationSelectors.CONTRADICTION).last()).toBeVisible();
        await page.screenshot({ scale: 'css', path: `../../.scratch/short-narration-hint-chain-outcome-${width}.png` });

        const panel = await page.getByTestId(HintPanelSelectors.Root).boundingBox();

        expect(panel).not.toBeNull();
        expect(panel?.x).toBeGreaterThanOrEqual(panelHorizontalGap);
        expect((panel?.x ?? 0) + (panel?.width ?? 0)).toBeLessThanOrEqual(width - panelHorizontalGap);
        expect((panel?.y ?? 0) + (panel?.height ?? 0)).toBeLessThanOrEqual(height - panelBottomGap);
        await expectHintBelowToolbar(page);
    });
}

for (const bottomInset of [0, mobileBottomInset]) {
    test(`keeps two fixed buttons across placement/elimination with ${bottomInset}px bottom inset`, async ({ page }) => {
        await page.setViewportSize({ width: mobileViewportWidth, height: viewportHeight });
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await launchHome(page);
        await openSharedPuzzle(page, pointingPairHintSharedPuzzleEncodedConstant);
        await page.getByTestId(SharedScreenSelectors.ConfirmButton).click();
        await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible({ timeout: gameScreenTimeoutMilliseconds });
        await page.getByTestId(HintButtonSelectors.Root).click();

        await page.addStyleTag({ content: `div[style*="safe-area-inset"] { padding-bottom: ${bottomInset}px !important; }` });
        await page.evaluate(() => window.dispatchEvent(new Event('resize')));
        await expect
            .poll(async () => {
                const panel = await page.getByTestId(HintPanelSelectors.Root).boundingBox();

                return (panel?.y ?? 0) + (panel?.height ?? 0);
            })
            .toBeLessThanOrEqual(viewportHeight - Math.max(bottomInset, panelHorizontalGap) - panelHorizontalGap);

        const footer = page.getByTestId(HintPanelSelectors.FOOTER);
        const buttons = footer.getByRole('button');
        const footerBounds = await footer.boundingBox();

        await expect(buttons).toHaveCount(2);
        await expect(page.getByTestId(HintPanelSelectors.BackButton)).toBeDisabled();
        expect(await page.getByTestId(HintPanelSelectors.BackButton).evaluate(element => getComputedStyle(element).opacity)).toBe('0.4');
        await revealHintWalkthrough(page);

        for (let stepIndex = 0; stepIndex < 4; stepIndex += 1) {
            await expect(buttons).toHaveCount(2);
            expect(await footer.boundingBox()).toEqual(footerBounds);

            const secondary = await buttons.nth(0).boundingBox();
            const primary = await buttons.nth(1).boundingBox();

            expect(secondary?.width).toBe(primary?.width);
            expect(secondary?.height).toBe(primary?.height);
            expect((primary?.y ?? 0) + (primary?.height ?? 0)).toBeLessThanOrEqual(viewportHeight - panelBottomGap);

            if (stepIndex < 3) {
                await page.getByTestId(HintPanelSelectors.NextButton).click();
            }
        }

        await expect(page.getByTestId(HintPanelSelectors.ApplyButton)).toHaveText('Place 4');
        await expect(page.getByTestId(HintPanelSelectors.RevealButton)).toHaveText('Reveal');
        await expectHintBelowToolbar(page);
        await page.getByTestId(HintPanelSelectors.RevealButton).click();
        await expect(page.getByTestId(HintStepNarrationSelectors.Technique)).toHaveText('Reveal');
        await page.getByTestId(HintPanelSelectors.NextButton).click();
        await page.getByTestId(HintPanelSelectors.ApplyButton).click();
        await expect(page.getByTestId(HintPanelSelectors.Root)).not.toBeVisible();
    });
}
