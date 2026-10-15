import { expect, test } from '@playwright/test';
import {
    CompletedGameItemSelectors,
    CompletedGameTechniqueSummarySelectors,
    FieldWitnessOverlaySelectors,
    GameScreenSelectors,
    HintButtonSelectors,
    HintPanelSelectors,
    HintStepNarrationSelectors,
    HistoryDifficultySelectors,
    HistoryGamesScreenSelectors,
    HomeScreenSelectors,
    PauseScreenSelectors,
    ReplayControlsSelectors,
    ReplayTechniqueSelectors,
    SharedScreenSelectors,
    WinnerScreenSelectors
} from '@suuudokuuu/app/src/selectors';

import {
    aicDetourHintSharedPuzzleEncodedConstant,
    eliminationHintSharedPuzzleEncodedConstant,
    hardcoreHintSharedPuzzleEncodedConstant,
    pointingPairHintSharedPuzzleEncodedConstant,
    revealHintSharedPuzzleEncodedConstant,
    structuredChainHintSharedPuzzleEncodedConstant
} from '../src/constants/shared-challenge-links.constant';
import { bringAppToForeground } from '../src/utils/bring-app-to-foreground.util';
import { launchHome } from '../src/utils/launch-home.util';
import { openSharedPuzzle } from '../src/utils/open-shared-puzzle.util';
import { sendAppToBackground } from '../src/utils/send-app-to-background.util';
import { startNewGame } from '../src/utils/start-new-game.util';
import { cellTestId, valueButtonTestId } from '../src/utils/test-id.util';

import type { Page } from '@playwright/test';

const mobileViewportWidth = 390;
const desktopViewportWidth = 1280;
const viewportHeight = 844;
const landscapeViewportWidth = 844;
const landscapeViewportHeight = 390;
const panelHorizontalGap = 12;
const panelBottomGap = 24;
const mobileBottomInset = 34;
const walkthroughFirstPage = 3;
const structuredChainHintIndex = 11;
const aicDetourChainHintIndex = 6;
const maxPatternCellCount = 12;

const revealPuzzle = '8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..';
const revealPuzzleSolution = '812753649943682175675491283154237896369845721287169534521974368438526917796318452';
const revealedCellIndex = 69;
const fieldSize = 9;

const gameScreenTimeoutMilliseconds = 15000;
const winnerScreenTimeoutMilliseconds = 30000;
const longHintTimeoutMilliseconds = 120000;

const readPageCount = async (page: Page): Promise<number> =>
    Number(
        /of (?<count>\d+)$/u.exec((await page.getByTestId(HintPanelSelectors.Progress).getAttribute('aria-label')) ?? '')?.groups?.['count']
    );

const revealHintWalkthrough = async (page: Page): Promise<void> => {
    const next = page.getByTestId(HintPanelSelectors.NextButton);

    await next.click();
    await next.click();
    await expect(page.getByTestId(HintPanelSelectors.Progress)).toHaveAttribute(
        'aria-label',
        new RegExp(`^Step ${walkthroughFirstPage} of `, 'u')
    );
};

const applyHintEarly = async (page: Page): Promise<void> => {
    const showAnswer = page.getByTestId(HintPanelSelectors.SHOW_ANSWER_BUTTON);
    const apply = page.getByTestId(HintPanelSelectors.ApplyButton);

    if ((await showAnswer.count()) > 0) {
        await showAnswer.click();
    }

    const isPlacement = (await apply.count()) > 0;

    await apply.or(page.getByTestId(HintPanelSelectors.ContinueButton)).click();

    if (isPlacement) {
        await expect(page.getByTestId(HintPanelSelectors.Root)).not.toBeVisible();
    } else {
        await expect(page.getByTestId(HintPanelSelectors.Progress)).toHaveAttribute('aria-label', /^Step 1 of \d+$/u);
    }
};

const openHintAfter = async (page: Page, appliedHintCount: number): Promise<void> => {
    for (let hintIndex = 0; hintIndex <= appliedHintCount; hintIndex += 1) {
        if ((await page.getByTestId(HintPanelSelectors.Root).count()) === 0) {
            await page.getByTestId(HintButtonSelectors.Root).click();
        }

        if (hintIndex < appliedHintCount) {
            await revealHintWalkthrough(page);
            await applyHintEarly(page);
        }
    }
};

const readBoardBounds = async (page: Page): Promise<readonly (number | undefined)[]> => {
    const firstCell = await page.getByTestId(cellTestId(0, 0)).boundingBox();
    const lastCell = await page.getByTestId(cellTestId(8, 8)).boundingBox();

    return [firstCell?.x, firstCell?.y, lastCell?.x, lastCell?.y, lastCell?.width, lastCell?.height];
};

const expectHintReplacesControls = async (page: Page, boardBounds: readonly (number | undefined)[]): Promise<void> => {
    expect(await readBoardBounds(page)).toEqual(boardBounds);
    expect(
        await page.getByTestId(HintButtonSelectors.Root).evaluate(element => {
            const bounds = element.getBoundingClientRect();

            return element.contains(document.elementFromPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2));
        })
    ).toBe(false);
};

const readCellAttributes = async (page: Page, attribute: 'aria-label' | 'background'): Promise<Map<string, string | null>> =>
    new Map(
        await page
            .getByTestId(/^CellSelectors\.Cell\./u)
            .evaluateAll(
                (elements, attributeName) =>
                    elements.map((element): readonly [string, string | null] => [
                        element.getAttribute('data-testid') ?? '',
                        attributeName === 'background' ? getComputedStyle(element).backgroundColor : element.getAttribute(attributeName)
                    ]),
                attribute
            )
    );

const readCellLabels = async (page: Page): Promise<Map<string, string | null>> => readCellAttributes(page, 'aria-label');

const findChangedCellLabels = async (page: Page, labelsBefore: Map<string, string | null>): Promise<string[]> => {
    const labelsAfter = await readCellLabels(page);

    return [...labelsAfter]
        .filter(([cellTestIdentifier, label]) => labelsBefore.get(cellTestIdentifier) !== label)
        .map(([, label]) => label ?? '');
};

const countTintedCells = async (page: Page, backgroundsBefore: Map<string, string | null>): Promise<number> =>
    [...(await readCellAttributes(page, 'background'))].filter(
        ([cellTestIdentifier, background]) => backgroundsBefore.get(cellTestIdentifier) !== background
    ).length;

const openSharedHintPuzzle = async (page: Page, encodedPuzzle: string): Promise<void> => {
    await launchHome(page);
    await openSharedPuzzle(page, encodedPuzzle);
    await page.getByTestId(SharedScreenSelectors.ConfirmButton).click();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible({ timeout: gameScreenTimeoutMilliseconds });
};

test('walks a hint from activation through the stepper, applying and a later dismiss', async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await launchHome(page);
    await startNewGame(page);

    const hintPanel = page.getByTestId(HintPanelSelectors.Root);
    const progress = page.getByTestId(HintPanelSelectors.Progress);
    const back = page.getByTestId(HintPanelSelectors.BackButton);
    const next = page.getByTestId(HintPanelSelectors.NextButton);
    const narration = page.getByTestId(HintStepNarrationSelectors.Narration);
    const boardBounds = await readBoardBounds(page);
    const backgroundsBefore = await readCellAttributes(page, 'background');

    await page.getByTestId(HintButtonSelectors.Root).click();

    await expect(hintPanel).toBeVisible();
    await expect(page.getByTestId(HintStepNarrationSelectors.Technique)).toHaveText(/.+/u);
    await expect(narration).toHaveText(/^Look for .+ (?:in (?:row|column|box) \d+|around cell R\dC\d)\.$/u);
    await expect(narration).toHaveAttribute('aria-live', 'polite');
    await expect(progress).toHaveAttribute('aria-label', /^Step 1 of \d+$/u);
    await expect(back).toBeDisabled();
    expect(await countTintedCells(page, backgroundsBefore)).toBeGreaterThan(0);
    await expect(page.getByTestId(HintPanelSelectors.ApplyButton)).toHaveCount(0);
    await expectHintReplacesControls(page, boardBounds);
    await page.screenshot({ scale: 'css', path: testInfo.outputPath('hint-level-1-technique.png'), fullPage: true });

    await next.click();
    await expect(narration).not.toHaveText(/^Look for /u);
    await expect(narration).toHaveText(/^[^:]+: [^1-9]*[1-9]/u);
    await expect(progress).toHaveAttribute('aria-label', /^Step 2 of \d+$/u);
    await expect(back).toBeEnabled();
    await back.click();
    await expect(progress).toHaveAttribute('aria-label', /^Step 1 of \d+$/u);
    await next.click();
    await expectHintReplacesControls(page, boardBounds);
    await page.screenshot({ scale: 'css', path: testInfo.outputPath('hint-level-2-pattern.png'), fullPage: true });

    await next.click();
    await expect(progress).toHaveAttribute('aria-label', /^Step 3 of \d+$/u);
    await expectHintReplacesControls(page, boardBounds);

    const labelsBefore = await readCellLabels(page);
    const pageCount = await readPageCount(page);

    for (let pageNumber = walkthroughFirstPage; pageNumber < pageCount; pageNumber += 1) {
        await expect(page.getByTestId(HintStepNarrationSelectors.Value)).toHaveCount(0);
        await next.click();
        await expect(progress).toHaveAttribute('aria-label', `Step ${pageNumber + 1} of ${pageCount}`);
    }

    await expect(next).toHaveCount(0);
    await expect(page.getByTestId(HintPanelSelectors.SHOW_ANSWER_BUTTON)).toHaveCount(0);

    const hintedDigit = await page.getByTestId(HintStepNarrationSelectors.Value).textContent();

    expect(hintedDigit).toMatch(/^[1-9]$/u);
    await expect(page.getByTestId(HintPanelSelectors.ApplyButton)).toHaveText(`Place ${hintedDigit ?? ''}`);
    await page.screenshot({ scale: 'css', path: testInfo.outputPath('hint-level-4-placement.png'), fullPage: true });

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

test('chains a pointing pair into the hidden single it enables and places the digit on the last page', async ({ page }) => {
    await openSharedHintPuzzle(page, pointingPairHintSharedPuzzleEncodedConstant);

    const hintPanel = page.getByTestId(HintPanelSelectors.Root);
    const progress = page.getByTestId(HintPanelSelectors.Progress);
    const technique = page.getByTestId(HintStepNarrationSelectors.Technique);
    const value = page.getByTestId(HintStepNarrationSelectors.Value);
    const next = page.getByTestId(HintPanelSelectors.NextButton);

    await page.getByTestId(HintButtonSelectors.Root).click();
    await next.click();
    await expect(page.getByTestId(HintStepNarrationSelectors.Narration)).toHaveText(
        'Pointing Pair: in box 6, 4 fits only in the highlighted cells, and they all lie in column 7.'
    );
    await next.click();

    await expect(progress).toHaveAttribute('aria-label', 'Step 3 of 6');
    await expect(technique).toHaveText('Pointing Pair');
    await expect(value).toHaveCount(0);

    await next.click();
    await expect(technique).toHaveText('Pointing Pair');

    await next.click();
    await expect(progress).toHaveAttribute('aria-label', 'Step 5 of 6');
    await expect(technique).toHaveText('Hidden Single');
    await expect(value).toHaveCount(0);

    await next.click();
    await expect(progress).toHaveAttribute('aria-label', 'Step 6 of 6');
    await expect(value).toHaveText('4');
    await page.getByTestId(HintPanelSelectors.ApplyButton).click();
    await expect(hintPanel).not.toBeVisible();
    await expect(page.getByTestId(cellTestId(2, 1))).toHaveAttribute('aria-label', 'Row 3, column 2, 4');

    await page.getByTestId(HintButtonSelectors.Root).click();
    await revealHintWalkthrough(page);
    await expect(progress).toHaveAttribute('aria-label', 'Step 3 of 4');
    await expect(technique).toHaveText('Hidden Single');
    await next.click();
    await expect(value).toHaveText('8');
});

test('shows a solution reveal as one page with the digit and its placement', async ({ page }, testInfo) => {
    await openSharedHintPuzzle(page, revealHintSharedPuzzleEncodedConstant);

    await page.getByTestId(HintButtonSelectors.Root).click();

    await expect(page.getByTestId(HintStepNarrationSelectors.Technique)).toHaveText('Reveal');
    await expect(page.getByTestId(HintPanelSelectors.Progress)).toHaveCount(0);
    await expect(page.getByTestId(HintPanelSelectors.NextButton)).toHaveCount(0);
    await expect(page.getByTestId(HintPanelSelectors.SHOW_ANSWER_BUTTON)).toHaveCount(0);
    await expect(page.getByTestId(HintStepNarrationSelectors.Value)).toHaveText('9');
    await expect(page.getByTestId(HintPanelSelectors.ApplyButton)).toHaveText('Place 9');
    await page.screenshot({ scale: 'css', path: testInfo.outputPath('hint-reveal.png'), fullPage: true });

    await page.getByTestId(HintPanelSelectors.ApplyButton).click();
    await expect(page.getByTestId(HintPanelSelectors.Root)).not.toBeVisible();
    await expect(page.getByTestId(cellTestId(7, 6))).toHaveAttribute('aria-label', 'Row 8, column 7, 9');
});

test('replays a reveal hint as a badged Guess and counts it on the history card', async ({ page }) => {
    await openSharedHintPuzzle(page, revealHintSharedPuzzleEncodedConstant);

    await page.getByTestId(HintButtonSelectors.Root).click();
    await page.getByTestId(HintPanelSelectors.ApplyButton).click();
    await expect(page.getByTestId(HintPanelSelectors.Root)).not.toBeVisible();

    for (let cellIndex = 0; cellIndex < revealPuzzle.length; cellIndex += 1) {
        if (revealPuzzle.charAt(cellIndex) === '.' && cellIndex !== revealedCellIndex) {
            await page.getByTestId(cellTestId(Math.floor(cellIndex / fieldSize), cellIndex % fieldSize)).click();
            await page.getByTestId(valueButtonTestId(Number(revealPuzzleSolution.charAt(cellIndex)))).click();
        }
    }

    await expect(page.getByTestId(WinnerScreenSelectors.Root)).toBeVisible({ timeout: winnerScreenTimeoutMilliseconds });
    await page.getByTestId(WinnerScreenSelectors.HomeButton).click();
    await expect(page.getByTestId(HomeScreenSelectors.Root)).toBeVisible();
    await page.getByText('Stats').click();
    await page.getByTestId(`${HistoryDifficultySelectors.Card}.Medium`).click();
    await expect(page.getByTestId(HistoryGamesScreenSelectors.Root)).toBeVisible();
    await expect(page.getByTestId(CompletedGameTechniqueSummarySelectors.HintSummary)).toHaveText('1 reveal');

    await page.getByTestId(CompletedGameItemSelectors.ReplayButton).click();
    await page.getByTestId(ReplayControlsSelectors.NextButton).click();
    await expect(page.getByTestId(ReplayTechniqueSelectors.Technique)).toHaveText('Guess 9');
    await expect(page.getByTestId(ReplayTechniqueSelectors.HintBadge)).toHaveText('via hint');

    await page.getByTestId(ReplayControlsSelectors.NextButton).click();
    await expect(page.getByTestId(ReplayTechniqueSelectors.Technique)).toBeVisible();
    await expect(page.getByTestId(ReplayTechniqueSelectors.HintBadge)).toHaveCount(0);
});

test('starts a fresh hint at level one after continuing an elimination', async ({ page }) => {
    await openSharedHintPuzzle(page, eliminationHintSharedPuzzleEncodedConstant);

    const progress = page.getByTestId(HintPanelSelectors.Progress);

    await page.getByTestId(HintButtonSelectors.Root).click();
    await revealHintWalkthrough(page);
    await expect(progress).toHaveAttribute('aria-label', /^Step 3 of \d+$/u);

    await page.getByTestId(HintPanelSelectors.SHOW_ANSWER_BUTTON).click();
    await expect(page.getByTestId(HintPanelSelectors.ContinueButton)).toHaveText('Apply & next');
    await page.getByTestId(HintPanelSelectors.ContinueButton).click();

    await expect(progress).toHaveAttribute('aria-label', /^Step 1 of \d+$/u);
    await expect(page.getByTestId(HintPanelSelectors.BackButton)).toBeDisabled();
});

test('walks a long Nishio and AIC hint link by link while the board stays untouched', async ({ page }, testInfo) => {
    test.setTimeout(longHintTimeoutMilliseconds);
    await openSharedHintPuzzle(page, structuredChainHintSharedPuzzleEncodedConstant);

    const apply = page.getByTestId(HintPanelSelectors.ApplyButton);
    const progress = page.getByTestId(HintPanelSelectors.Progress);
    const next = page.getByTestId(HintPanelSelectors.NextButton);
    const back = page.getByTestId(HintPanelSelectors.BackButton);

    await openHintAfter(page, structuredChainHintIndex);

    const labelsBefore = await readCellLabels(page);

    await revealHintWalkthrough(page);

    const pageCount = await readPageCount(page);

    expect(pageCount).toBeGreaterThan(9);

    const branch = page.getByTestId(FieldWitnessOverlaySelectors.Branch);
    const outcome = page.getByTestId(FieldWitnessOverlaySelectors.Outcome);
    const chain = page.getByTestId(FieldWitnessOverlaySelectors.Chain);
    const linkProgress = page.getByTestId(HintStepNarrationSelectors.LINK_PROGRESS);
    const techniqueNames = new Set<string>();
    let sawBranch = false;
    let sawOutcome = false;

    for (let pageNumber = walkthroughFirstPage; pageNumber <= pageCount; pageNumber += 1) {
        techniqueNames.add((await page.getByTestId(HintStepNarrationSelectors.Technique).textContent()) ?? '');

        if (!sawBranch && (await branch.count())) {
            sawBranch = true;
            expect(await readCellLabels(page)).toEqual(labelsBefore);
            await expect(linkProgress).toHaveText(/^Link 1 of \d+$/u);
            await page.screenshot({ scale: 'css', path: testInfo.outputPath('hint-chain-walkthrough.png'), fullPage: true });
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

        if (pageNumber < pageCount) {
            await next.click();
            await expect(progress).toHaveAttribute('aria-label', `Step ${pageNumber + 1} of ${pageCount}`);
        }
    }

    expect(sawBranch).toBe(true);
    expect(sawOutcome).toBe(true);
    expect(techniqueNames.has('Nishio Forcing Chain')).toBe(true);
    expect(techniqueNames.has('AIC')).toBe(true);

    await apply.click();
    await expect(page.getByTestId(cellTestId(5, 8))).toHaveAttribute('aria-label', 'Row 6, column 9, 1');
});

test('teaches the reported Hardcore board a lone pointing pair, then the AIC elimination alone', async ({ page }) => {
    await openSharedHintPuzzle(page, hardcoreHintSharedPuzzleEncodedConstant);

    const technique = page.getByTestId(HintStepNarrationSelectors.Technique);
    const narration = page.getByTestId(HintStepNarrationSelectors.Narration);
    const next = page.getByTestId(HintPanelSelectors.NextButton);
    const continueButton = page.getByTestId(HintPanelSelectors.ContinueButton);
    const backgroundsBefore = await readCellAttributes(page, 'background');

    await page.getByTestId(HintButtonSelectors.Root).click();
    await next.click();
    await expect(narration).toHaveText('Pointing Pair: in box 8, 5 fits only in the highlighted cells, and they all lie in row 7.');
    await page.getByTestId(HintPanelSelectors.SHOW_ANSWER_BUTTON).click();
    await expect(continueButton).toHaveText('Apply & next');
    await continueButton.click();

    await expect(technique).toHaveText('AIC');
    await next.click();
    await expect(narration).toHaveText('AIC: a chain links the highlighted ends, so (2)r3c7 or (5)r9c7 is true.');
    expect(await countTintedCells(page, backgroundsBefore)).toBeLessThanOrEqual(maxPatternCellCount);

    await page.getByTestId(HintPanelSelectors.SHOW_ANSWER_BUTTON).click();
    await expect(narration).toHaveText(
        'AIC: one end of the chain is always true and each marked candidate clashes with both ends, so r9c7 cannot be 2.'
    );
    expect(await countTintedCells(page, backgroundsBefore)).toBeLessThanOrEqual(maxPatternCellCount);
    await expect(page.getByTestId(HintPanelSelectors.ApplyButton)).toHaveCount(0);
    await expect(continueButton).toHaveText('Apply & next');
});

test('routes the reported AIC board through lone pointing pairs to an AIC elimination and opens each page at the top', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await openSharedHintPuzzle(page, aicDetourHintSharedPuzzleEncodedConstant);

    const technique = page.getByTestId(HintStepNarrationSelectors.Technique);
    const narration = page.getByTestId(HintStepNarrationSelectors.Narration);
    const narrationScroll = page.getByTestId(HintStepNarrationSelectors.NARRATION_SCROLL);
    const next = page.getByTestId(HintPanelSelectors.NextButton);
    const continueButton = page.getByTestId(HintPanelSelectors.ContinueButton);

    await page.getByTestId(HintButtonSelectors.Root).click();
    await revealHintWalkthrough(page);
    await expect(technique).toHaveText('Pointing Pair');
    await page.getByTestId(HintPanelSelectors.SHOW_ANSWER_BUTTON).click();
    await expect(continueButton).toHaveText('Apply & next');
    await continueButton.click();

    await openHintAfter(page, aicDetourChainHintIndex - 1);
    await revealHintWalkthrough(page);
    await expect(technique).toHaveText('AIC');

    await narrationScroll.evaluate(element => {
        element.scrollTop = element.scrollHeight;
    });

    await next.click();
    expect(await narrationScroll.evaluate(element => element.scrollTop)).toBe(0);

    while ((await next.count()) > 0) {
        await next.click();
    }

    await expect(narration).toHaveText(
        'AIC: one end of the chain is always true and each marked candidate clashes with both ends, so r5c6 cannot be 2, 3, 9.'
    );
    await expect(page.getByTestId(HintPanelSelectors.ApplyButton)).toHaveCount(0);
    await continueButton.click();
    await expect(page.getByTestId(HintPanelSelectors.Progress)).toHaveAttribute('aria-label', /^Step 1 of \d+$/u);
});

test('continues forcing-chain elimination hints and shows the answer from their first page', async ({ page }) => {
    await openSharedHintPuzzle(page, eliminationHintSharedPuzzleEncodedConstant);

    const progress = page.getByTestId(HintPanelSelectors.Progress);
    const narration = page.getByTestId(HintStepNarrationSelectors.Narration);

    await page.getByTestId(HintButtonSelectors.Root).click();

    for (let hintIndex = 0; hintIndex < 3; hintIndex += 1) {
        await revealHintWalkthrough(page);
        await applyHintEarly(page);
    }

    await revealHintWalkthrough(page);
    await expect(page.getByTestId(HintPanelSelectors.ApplyButton)).toHaveCount(0);

    const labelsBefore = await readCellLabels(page);
    const pageCount = await readPageCount(page);

    await page.getByTestId(HintPanelSelectors.SHOW_ANSWER_BUTTON).click();
    await expect(progress).toHaveAttribute('aria-label', `Step ${pageCount} of ${pageCount}`);
    await expect(narration).toHaveText(/^Nishio Forcing Chain: .+ so 9 is ruled out of the marked cells\.$/u);

    await page.getByTestId(HintPanelSelectors.ContinueButton).click();
    await expect(progress).toHaveAttribute('aria-label', /^Step 1 of \d+$/u);
    expect(await readCellLabels(page)).toEqual(labelsBefore);

    await page.getByTestId(HintPanelSelectors.SHOW_ANSWER_BUTTON).click();
    await expect(narration).toHaveText(/^If r2c7=6 → r\dc\d runs out of candidates\. So r2c7 is not 6\.$/u);
    await expect(page.getByTestId(HintPanelSelectors.ContinueButton)).toHaveText('Apply & next');
});

for (const viewport of [
    { width: mobileViewportWidth, height: viewportHeight },
    { width: desktopViewportWidth, height: viewportHeight },
    { width: landscapeViewportWidth, height: landscapeViewportHeight }
]) {
    const { width, height } = viewport;
    test(`renders the revealed chain links inside the safe-area gap at ${width}x${height}`, async ({ page }, testInfo) => {
        await page.setViewportSize(viewport);
        await openSharedHintPuzzle(page, structuredChainHintSharedPuzzleEncodedConstant);

        const boardBounds = await readBoardBounds(page);

        await openHintAfter(page, structuredChainHintIndex);
        await revealHintWalkthrough(page);

        const contradiction = page.getByTestId(HintStepNarrationSelectors.CONTRADICTION);
        const next = page.getByTestId(HintPanelSelectors.NextButton);

        while ((await contradiction.count()) === 0) {
            await next.click();
        }

        await expect(page.getByTestId(FieldWitnessOverlaySelectors.Branch)).not.toHaveCount(0);
        await expect(page.getByTestId(HintStepNarrationSelectors.Narration)).toHaveText('Contradiction, so R8C5 is not 6.');
        await expect(page.getByTestId(HintStepNarrationSelectors.Narration)).toHaveAttribute(
            'aria-label',
            /If r8c5=6 → r9c4=7 → .+So r8c5 is not 6\./u
        );

        const chainBlocks = page.getByTestId(HintStepNarrationSelectors.CHAIN_BLOCKS);

        await expect(chainBlocks).toBeVisible();
        await expect(chainBlocks).toContainText(/R\dC\d = \d/u);
        await expect(page.getByTestId(HintStepNarrationSelectors.LINK_PROGRESS)).toHaveText(/^Link (?<count>\d+) of \k<count>$/u);
        await page.screenshot({ scale: 'css', path: testInfo.outputPath(`hint-chain-outcome-${width}.png`) });

        const finalCandidate = chainBlocks.getByText(/^R\dC\d = \d$/u).last();

        await finalCandidate.scrollIntoViewIfNeeded();
        await expect(finalCandidate).toBeInViewport({ ratio: 1 });
        await contradiction.last().scrollIntoViewIfNeeded();
        await expect(contradiction.last()).toBeInViewport({ ratio: 1 });
        await expect(page.getByTestId(HintPanelSelectors.FOOTER)).toBeInViewport({ ratio: 1 });

        const panel = await page.getByTestId(HintPanelSelectors.Root).boundingBox();

        expect(panel).not.toBeNull();
        expect((panel?.y ?? 0) + (panel?.height ?? 0)).toBeLessThanOrEqual(height);
        if (width === mobileViewportWidth) {
            expect(panel?.x).toBeGreaterThanOrEqual(panelHorizontalGap);
            expect((panel?.x ?? 0) + (panel?.width ?? 0)).toBeLessThanOrEqual(width - panelHorizontalGap);
            expect((panel?.y ?? 0) + (panel?.height ?? 0)).toBeLessThanOrEqual(height - panelBottomGap);
        }
        await expectHintReplacesControls(page, boardBounds);
    });
}

for (const bottomInset of [0, mobileBottomInset]) {
    test(`keeps the stepper row in place across pages with ${bottomInset}px bottom inset`, async ({ page }) => {
        await page.setViewportSize({ width: mobileViewportWidth, height: viewportHeight });
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await openSharedHintPuzzle(page, pointingPairHintSharedPuzzleEncodedConstant);
        const boardBounds = await readBoardBounds(page);

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
        const back = page.getByTestId(HintPanelSelectors.BackButton);
        const footerBounds = await footer.boundingBox();
        const pageCount = await readPageCount(page);

        await expect(back).toBeDisabled();
        expect(await back.evaluate(element => getComputedStyle(element).opacity)).toBe('0.4');

        for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
            await expect(buttons).toHaveCount(2);
            expect(await footer.boundingBox()).toEqual(footerBounds);

            const primary = await buttons.nth(1).boundingBox();

            expect((await buttons.nth(0).boundingBox())?.height).toBe(primary?.height);
            expect((primary?.y ?? 0) + (primary?.height ?? 0)).toBeLessThanOrEqual(viewportHeight - panelBottomGap);

            if (pageNumber < pageCount) {
                await page.getByTestId(HintPanelSelectors.NextButton).click();
                await expect(back).toBeEnabled();
            }
        }

        await expect(page.getByTestId(HintPanelSelectors.ApplyButton)).toHaveText('Place 4');
        await expectHintReplacesControls(page, boardBounds);
        await page.getByTestId(HintPanelSelectors.ApplyButton).click();
        await expect(page.getByTestId(HintPanelSelectors.Root)).not.toBeVisible();
    });
}

test('keeps the open hint on the same page across pause and resume without charging again', async ({ page }) => {
    await page.setViewportSize({ width: mobileViewportWidth, height: viewportHeight });
    await openSharedHintPuzzle(page, pointingPairHintSharedPuzzleEncodedConstant);

    const progress = page.getByTestId(HintPanelSelectors.Progress);
    const score = page.getByTestId(GameScreenSelectors.Score);

    await page.getByTestId(HintButtonSelectors.Root).click();
    await revealHintWalkthrough(page);
    await page.getByTestId(HintPanelSelectors.NextButton).click();
    await expect(progress).toHaveAttribute('aria-label', 'Step 4 of 6');

    const narrationBefore = await page.getByTestId(HintStepNarrationSelectors.Narration).textContent();
    const scoreBefore = await score.textContent();

    await sendAppToBackground(page);
    await expect(page.getByTestId(PauseScreenSelectors.Root)).toBeVisible({ timeout: gameScreenTimeoutMilliseconds });
    await bringAppToForeground(page);
    await page.getByTestId(PauseScreenSelectors.ResumeButton).click();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible({ timeout: gameScreenTimeoutMilliseconds });

    await expect(page.getByTestId(HintPanelSelectors.Root)).toBeVisible();
    await expect(progress).toHaveAttribute('aria-label', 'Step 4 of 6');
    await expect(page.getByTestId(HintStepNarrationSelectors.Narration)).toHaveText(narrationBefore ?? '');
    await expect(score).toHaveText(scoreBefore ?? '');
});

test('ignores board keys while a hint is open and closes the hint with Escape', async ({ page }) => {
    await openSharedHintPuzzle(page, pointingPairHintSharedPuzzleEncodedConstant);

    const hintPanel = page.getByTestId(HintPanelSelectors.Root);
    const hintedCell = page.getByTestId(cellTestId(2, 1));
    const notedCell = page.getByTestId(cellTestId(0, 0));
    const dialogMessages: string[] = [];

    page.on('dialog', dialog => {
        dialogMessages.push(dialog.message());
        void dialog.dismiss();
    });

    const notedCellLabel = await notedCell.getAttribute('aria-label');

    await notedCell.click();
    await page.keyboard.press('Shift+Digit5');
    await expect(notedCell).not.toHaveAttribute('aria-label', notedCellLabel ?? '');

    await page.getByTestId(HintButtonSelectors.Root).click();
    await expect(hintPanel).toBeVisible();
    await hintedCell.click();

    const labelsBefore = await readCellLabels(page);

    await page.keyboard.press('4');
    await page.keyboard.press('Shift+Digit4');
    await page.keyboard.press('Control+z');
    expect(await findChangedCellLabels(page, labelsBefore)).toEqual([]);
    await expect(hintPanel).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(hintPanel).not.toBeVisible();
    expect(dialogMessages).toEqual([]);

    await page.keyboard.press('4');
    await expect(hintedCell).toHaveAttribute('aria-label', 'Row 3, column 2, 4');
    await page.keyboard.press('Control+z');
    await page.keyboard.press('Control+z');
    await expect(notedCell).toHaveAttribute('aria-label', notedCellLabel ?? '');
});
