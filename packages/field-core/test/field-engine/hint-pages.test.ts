import { it } from '@effect/vitest';
import { DifficultyEnum } from '@suuudokuuu/generator';
import * as Effect from 'effect/Effect';
import { assert, describe } from 'vitest';

import { FieldEngine } from '../../src/field-engine/classes/field-engine';
import { HintLevelEnum } from '../../src/step-script/enums/hint-level.enum';
import { StepScriptStepKindEnum } from '../../src/step-script/enums/step-script-step-kind.enum';
import { buildStepScriptState } from '../../src/step-script/utils/build-step-script-state.util';
import { findHintStepScript, findRevealStepScript } from '../../src/step-script/utils/find-hint-step-script.util';

import type { StepScriptBranchStepInterface } from '../../src/step-script/interfaces/step-script-branch-step.interface';
import type { StepScriptInterface } from '../../src/step-script/interfaces/step-script.interface';

const chainBoard = '.3.1.......17..63.5..623..1...2...13..38.1..61..3.48..357986142894512367.1.437.8.';
const forcingBoard = '..3..2.6.9..3.1...1.2.5..8.........2..5..3.98...4..1....7.....5.2..6....4.19.....';
const longBranchImplicationCount = 10;
const firstGroupedLinkCount = 7;
const forcingHintIndex = 4;

const createEngine = (sudokuString: string): FieldEngine => new FieldEngine({ sudokuString, difficulty: DifficultyEnum.Medium });

const requireHint = (engine: FieldEngine): StepScriptInterface => {
    const script = findHintStepScript(engine.Sudoku, engine.getSnapshot().eliminatedCandidates);

    assert(script !== null, 'Expected a hint script');

    return script;
};

const findBranchHint = (): { engine: FieldEngine; script: StepScriptInterface; branch: StepScriptBranchStepInterface } => {
    const engine = new FieldEngine({ sudokuString: forcingBoard, difficulty: DifficultyEnum.Medium, showAutoCandidates: true });

    let script = requireHint(engine);

    for (let hintIndex = 0; hintIndex < forcingHintIndex; hintIndex += 1) {
        engine.startStepScript(script);
        engine.applyStepScript();
        script = requireHint(engine);
    }

    const branch = script.steps.find(step => step.kind === StepScriptStepKindEnum.SHOW_BRANCH);

    assert(branch?.kind === StepScriptStepKindEnum.SHOW_BRANCH, 'Expected a forcing branch');

    return { engine, script, branch };
};

const collectRevealedImplicationCounts = (engine: FieldEngine, stepIndex: number): number[] => {
    const counts: number[] = [];

    engine.hintSkipToEnd();

    for (let pageIndex = engine.getSnapshot().hintPageIndex; pageIndex >= 0; pageIndex -= 1) {
        const snapshot = engine.getSnapshot();

        if (snapshot.hintLevel === HintLevelEnum.WALKTHROUGH && snapshot.stepIndex === stepIndex) {
            counts.unshift(snapshot.revealedImplicationCount);
        }

        engine.hintBack();
    }

    return counts;
};

describe('hint pages', () => {
    it.effect('publishes no pages without a script and ignores page commands', () =>
        Effect.sync(() => {
            const engine = createEngine(chainBoard);

            assert.strictEqual(engine.hintNext(), false);
            assert.strictEqual(engine.hintSkipToEnd(), 0);
            engine.hintBack();
            assert.deepInclude(engine.getSnapshot(), {
                hintPageIndex: 0,
                hintPageCount: 0,
                revealedImplicationCount: 0,
                stepIndex: 0,
                isNextPageCharged: false
            });
        })
    );

    it.effect('counts the level pages and one page per step of a merged chain', () =>
        Effect.sync(() => {
            const engine = createEngine(chainBoard);
            const script = requireHint(engine);

            engine.startStepScript(script, HintLevelEnum.TECHNIQUE);

            assert.isAbove(script.steps.length, 3);
            assert.deepInclude(engine.getSnapshot(), { hintPageIndex: 0, hintPageCount: script.steps.length + 2 });

            engine.startStepScript(script, HintLevelEnum.PATTERN);

            assert.deepInclude(engine.getSnapshot(), { hintLevel: HintLevelEnum.PATTERN, hintPageCount: script.steps.length + 1 });

            engine.startStepScript(script);

            assert.deepInclude(engine.getSnapshot(), { hintLevel: HintLevelEnum.WALKTHROUGH, hintPageCount: script.steps.length });
        })
    );

    it.effect('reports a new level only the first time Next reveals it', () =>
        Effect.sync(() => {
            const engine = createEngine(chainBoard);
            const script = requireHint(engine);

            engine.startStepScript(script, HintLevelEnum.TECHNIQUE);

            assert.strictEqual(engine.getSnapshot().isNextPageCharged, true);
            assert.strictEqual(engine.hintNext(), true);
            assert.deepInclude(engine.getSnapshot(), { hintLevel: HintLevelEnum.PATTERN, hintPageIndex: 1, isNextPageCharged: true });
            assert.strictEqual(engine.hintNext(), true);
            assert.deepInclude(engine.getSnapshot(), {
                hintLevel: HintLevelEnum.WALKTHROUGH,
                hintPageIndex: 2,
                stepIndex: 0,
                isNextPageCharged: false
            });
            assert.strictEqual(engine.hintNext(), false);
            assert.deepInclude(engine.getSnapshot(), { hintLevel: HintLevelEnum.WALKTHROUGH, hintPageIndex: 3, stepIndex: 1 });

            engine.hintBack();
            engine.hintBack();
            engine.hintBack();

            assert.deepInclude(engine.getSnapshot(), { hintLevel: HintLevelEnum.TECHNIQUE, hintPageIndex: 0, isNextPageCharged: false });

            engine.hintBack();

            assert.strictEqual(engine.getSnapshot().hintPageIndex, 0);
            assert.strictEqual(engine.hintNext(), false);
            assert.strictEqual(engine.hintNext(), false);
            assert.strictEqual(engine.hintSkipToEnd(), 0);
            assert.deepInclude(engine.getSnapshot(), {
                hintPageIndex: script.steps.length + 1,
                stepIndex: script.steps.length - 1
            });
            assert.strictEqual(engine.hintNext(), false);
            assert.strictEqual(engine.getSnapshot().hintPageIndex, script.steps.length + 1);
        })
    );

    it.effect('counts every level a skip to the end reveals', () =>
        Effect.sync(() => {
            const engine = createEngine(chainBoard);
            const script = requireHint(engine);

            engine.startStepScript(script, HintLevelEnum.TECHNIQUE);

            assert.strictEqual(engine.hintSkipToEnd(), 2);
            assert.strictEqual(engine.hintSkipToEnd(), 0);

            engine.startStepScript(script, HintLevelEnum.PATTERN);

            assert.strictEqual(engine.hintSkipToEnd(), 1);

            engine.startStepScript(script);

            assert.strictEqual(engine.hintSkipToEnd(), 0);
            engine.stopStepScript();
            assert.deepInclude(engine.getSnapshot(), { hintPageIndex: 0, hintPageCount: 0, hintLevel: HintLevelEnum.WALKTHROUGH });
        })
    );

    it.effect('shows an explicit reveal on one page without levels', () =>
        Effect.sync(() => {
            const engine = createEngine(chainBoard);
            const revealScript = findRevealStepScript(engine.Sudoku);

            assert(revealScript !== null, 'Expected a reveal script');
            engine.startStepScript(revealScript, HintLevelEnum.TECHNIQUE);

            assert.deepInclude(engine.getSnapshot(), { hintLevel: HintLevelEnum.WALKTHROUGH, hintPageCount: 1, stepIndex: 0 });
            assert.strictEqual(engine.hintNext(), false);
            assert.strictEqual(engine.hintSkipToEnd(), 0);
        })
    );

    it.effect('reveals a short forcing branch one implication per page', () =>
        Effect.sync(() => {
            const { engine, script, branch } = findBranchHint();
            const branchIndex = script.steps.indexOf(branch);
            const implicationCount = branch.branch.implications.length;

            engine.startStepScript(script, HintLevelEnum.TECHNIQUE);

            assert.isAtMost(implicationCount, 6);
            assert.deepEqual(
                collectRevealedImplicationCounts(engine, branchIndex),
                Array.from({ length: implicationCount }, (_, index) => index + 1)
            );

            const { stepIndex, hintLevel, revealedImplicationCount } = engine.getSnapshot();

            assert.strictEqual(buildStepScriptState(script, stepIndex, hintLevel, revealedImplicationCount).revealedImplicationCount, 0);
            assert.strictEqual(buildStepScriptState(script, branchIndex, HintLevelEnum.WALKTHROUGH, 2).revealedImplicationCount, 2);
            assert.strictEqual(buildStepScriptState(script, branchIndex).revealedImplicationCount, implicationCount);
        })
    );

    it.effect('reveals a forcing branch of more than six implications in groups of four', () =>
        Effect.sync(() => {
            const { engine, script, branch } = findBranchHint();
            const implications = Array.from(
                { length: longBranchImplicationCount },
                (_, index) => branch.branch.implications[index % branch.branch.implications.length]
            );
            const longBranch = { ...branch, branch: { ...branch.branch, implications } };
            const longScript = { ...script, steps: script.steps.map(step => (step === branch ? longBranch : step)) };

            engine.startStepScript(longScript);

            assert.deepEqual(collectRevealedImplicationCounts(engine, script.steps.indexOf(branch)), [4, 8, 10]);

            const sevenLinkBranch = { ...branch, branch: { ...branch.branch, implications: implications.slice(0, firstGroupedLinkCount) } };

            engine.startStepScript({ ...script, steps: script.steps.map(step => (step === branch ? sevenLinkBranch : step)) });

            assert.deepEqual(collectRevealedImplicationCounts(engine, script.steps.indexOf(branch)), [4, firstGroupedLinkCount]);
        })
    );

    it.effect('keeps step navigation on whole steps for plain playback', () =>
        Effect.sync(() => {
            const { engine, script, branch } = findBranchHint();
            const branchIndex = script.steps.indexOf(branch);

            engine.startStepScript(script);

            while (engine.getSnapshot().stepIndex <= branchIndex) {
                engine.stepScriptNext();
            }

            engine.stepScriptBack();

            assert.deepInclude(engine.getSnapshot(), {
                stepIndex: branchIndex,
                revealedImplicationCount: branch.branch.implications.length
            });
            assert.strictEqual(engine.stepScriptReset(), true);
            assert.deepInclude(engine.getSnapshot(), { hintPageIndex: 0, stepIndex: 0 });
        })
    );
});
