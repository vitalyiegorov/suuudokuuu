import { it } from '@effect/vitest';
import { DifficultyEnum } from '@suuudokuuu/generator';
import * as Effect from 'effect/Effect';
import { assert, describe } from 'vitest';

import { getCellKey } from '../../src/@generic/utils/get-cell-key.util';
import { FieldEngine } from '../../src/field-engine/classes/field-engine';
import { HintLevelEnum } from '../../src/step-script/enums/hint-level.enum';
import { HintRegionKindEnum } from '../../src/step-script/enums/hint-region-kind.enum';
import { StepScriptStepKindEnum } from '../../src/step-script/enums/step-script-step-kind.enum';
import { buildStepScriptState } from '../../src/step-script/utils/build-step-script-state.util';
import { findHintStepScript } from '../../src/step-script/utils/find-hint-step-script.util';
import { findStepScript } from '../../src/step-script/utils/find-step-script.util';
import { getHintRegion } from '../../src/step-script/utils/get-hint-region.util';

import type { StepScriptInterface } from '../../src/step-script/interfaces/step-script.interface';
import type { CellInterface } from '@suuudokuuu/generator';

const nakedPairBoard = '.34.7.91.672195348.9.34.567859761423426.5379.713924856961537284287419635345286179';

const createCell = (y: number, x: number): CellInterface => ({ x, y, value: 0, group: Math.floor(y / 3) * 3 + Math.floor(x / 3) });

const createHintEngine = (): { engine: FieldEngine; script: StepScriptInterface } => {
    const engine = new FieldEngine({ sudokuString: nakedPairBoard, difficulty: DifficultyEnum.Newbie });
    const script = findStepScript(engine.Sudoku);

    assert(script !== null, 'Expected a hint script');

    return { engine, script };
};

describe('progressive hint levels', () => {
    it.effect('advances logical hints while keeping ordinary playback at the walkthrough', () =>
        Effect.sync(() => {
            const { engine, script } = createHintEngine();

            assert.strictEqual(engine.revealNextHintLevel(), false);
            engine.startStepScript(script);
            assert.strictEqual(engine.getSnapshot().hintLevel, HintLevelEnum.WALKTHROUGH);
            engine.startStepScript(script, HintLevelEnum.TECHNIQUE);
            assert.strictEqual(engine.getSnapshot().hintLevel, HintLevelEnum.TECHNIQUE);
            assert.strictEqual(engine.revealNextHintLevel(), true);
            assert.strictEqual(engine.getSnapshot().hintLevel, HintLevelEnum.PATTERN);
            assert.strictEqual(engine.revealNextHintLevel(), true);
            assert.strictEqual(engine.getSnapshot().hintLevel, HintLevelEnum.WALKTHROUGH);
            assert.strictEqual(engine.revealNextHintLevel(), false);
            engine.startStepScript(script, HintLevelEnum.TECHNIQUE);
            engine.stopStepScript();
            assert.deepInclude(engine.getSnapshot(), { stepScript: null, hintLevel: HintLevelEnum.WALKTHROUGH });
        })
    );

    it.effect('shows strictly more of the same script at every level', () =>
        Effect.sync(() => {
            const { script } = createHintEngine();
            const techniqueState = buildStepScriptState(script, 0, HintLevelEnum.TECHNIQUE);
            const patternState = buildStepScriptState(script, 0, HintLevelEnum.PATTERN);
            const walkthroughState = buildStepScriptState(script, 0, HintLevelEnum.WALKTHROUGH);

            assert.deepEqual(techniqueState.patternCellKeys.size, 0);
            assert.isAbove(patternState.patternCellKeys.size, 0);
            assert.deepEqual(patternState.patternCellKeys, new Set(script.patternCells.map(getCellKey)));
            assert.deepEqual(patternState.revealedCandidates.size, 0);
            assert.isAbove(walkthroughState.revealedCandidates.size, 0);
            assert.deepEqual(walkthroughState.patternCellKeys, patternState.patternCellKeys);
            assert.deepEqual(buildStepScriptState(null, 0, HintLevelEnum.PATTERN).patternCellKeys.size, 0);
        })
    );

    it.effect('highlights only the first pattern in a multi-technique hint', () =>
        Effect.sync(() => {
            const engine = new FieldEngine({
                sudokuString: '.3.1.......17..63.5..623..1...2...13..38.1..61..3.48..357986142894512367.1.437.8.',
                difficulty: DifficultyEnum.Medium
            });
            const script = findHintStepScript(engine.Sudoku);

            assert(script !== null, 'Expected a hint script');

            const firstReveal = script.steps.find(step => step.kind === StepScriptStepKindEnum.RevealCandidates);

            assert(firstReveal !== undefined, 'Expected a pattern');
            assert.deepEqual(
                buildStepScriptState(script, 0, HintLevelEnum.PATTERN).patternCellKeys,
                new Set(firstReveal.patternCells.map(getCellKey))
            );
            assert.isAbove(script.patternCells.length, firstReveal.patternCells.length);
        })
    );
});

describe('getHintRegion', () => {
    it.effect('names a shared row, column, or box', () =>
        Effect.sync(() => {
            assert.deepEqual(getHintRegion([createCell(2, 0), createCell(2, 5)]), { kind: HintRegionKindEnum.ROW, number: 3 });
            assert.deepEqual(getHintRegion([createCell(0, 5), createCell(7, 5)]), { kind: HintRegionKindEnum.COLUMN, number: 6 });
            assert.deepEqual(getHintRegion([createCell(3, 3), createCell(4, 5)]), { kind: HintRegionKindEnum.BOX, number: 5 });
        })
    );

    it.effect('names no region for a lone cell or scattered cells', () =>
        Effect.sync(() => {
            assert.isNull(getHintRegion([createCell(1, 1)]));
            assert.isNull(getHintRegion([]));
            assert.isNull(getHintRegion([createCell(0, 0), createCell(4, 8)]));
        })
    );

    it.effect('uses the first deduction placement row when pattern cells span regions', () =>
        Effect.sync(() => {
            assert.deepEqual(getHintRegion([createCell(0, 0), createCell(4, 8)], createCell(6, 2)), {
                kind: HintRegionKindEnum.ROW,
                number: 7
            });
        })
    );
});
