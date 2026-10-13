import { it } from '@effect/vitest';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { CandidateContext, SolutionTechniqueEnum, createTechniqueStrategies } from '@suuudokuuu/techniques';
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
import { techniqueResultToStepScript } from '../../src/step-script/utils/technique-result-to-step-script.util';

import type { StepScriptInterface } from '../../src/step-script/interfaces/step-script.interface';
import type { CellInterface } from '@suuudokuuu/generator';

const nakedPairBoard = '.34.7.91.672195348.9.34.567859761423426.5379.713924856961537284287419635345286179';

const hiddenSingleBoard = [
    '001004800',
    '302000045',
    '540003090',
    '800040300',
    '000905410',
    '400006002',
    '030008600',
    '050370000',
    '100400000'
].join('');

const forcingHintIndex = 11;

const fieldCells = new FieldEngine({ sudokuString: nakedPairBoard, difficulty: DifficultyEnum.Newbie }).Sudoku.Field;

const createCell = (y: number, x: number): CellInterface => fieldCells[y][x];

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

            assert.strictEqual(engine.hintNext(), false);
            engine.startStepScript(script);
            assert.strictEqual(engine.getSnapshot().hintLevel, HintLevelEnum.WALKTHROUGH);
            engine.startStepScript(script, HintLevelEnum.TECHNIQUE);
            assert.strictEqual(engine.getSnapshot().hintLevel, HintLevelEnum.TECHNIQUE);
            assert.strictEqual(engine.hintNext(), true);
            assert.strictEqual(engine.getSnapshot().hintLevel, HintLevelEnum.PATTERN);
            assert.strictEqual(engine.hintNext(), true);
            assert.strictEqual(engine.getSnapshot().hintLevel, HintLevelEnum.WALKTHROUGH);
            assert.strictEqual(engine.hintNext(), false);
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
            assert.deepEqual(getHintRegion([createCell(0, 6), createCell(1, 8)]), { kind: HintRegionKindEnum.BOX, number: 3 });
            assert.deepEqual(getHintRegion([createCell(6, 0), createCell(8, 1)]), { kind: HintRegionKindEnum.BOX, number: 7 });
            assert.deepEqual(getHintRegion([createCell(7, 7), createCell(8, 8)]), { kind: HintRegionKindEnum.BOX, number: 9 });
        })
    );

    it.effect('numbers the box of a real hidden single rows first', () =>
        Effect.sync(() => {
            const engine = new FieldEngine({ sudokuString: hiddenSingleBoard, difficulty: DifficultyEnum.Hard });
            const [hiddenSingleStrategy] = createTechniqueStrategies().filter(
                strategy => strategy.technique === SolutionTechniqueEnum.HiddenSingle
            );
            const hiddenSingle = hiddenSingleStrategy
                .find(CandidateContext.fromSudoku(engine.Sudoku))
                .find(
                    result =>
                        result.cell.y === 8 && result.cell.x === 4 && result.reasonCells.every(cell => cell.group === result.cell.group)
                );

            assert(hiddenSingle !== undefined, 'Expected a box hidden single at R9C5');
            assert.deepEqual(getHintRegion(hiddenSingle.reasonCells, hiddenSingle.cell), { kind: HintRegionKindEnum.BOX, number: 8 });
        })
    );

    it.effect('names no region for a lone cell or scattered cells', () =>
        Effect.sync(() => {
            assert.isNull(getHintRegion([createCell(1, 1)]));
            assert.isNull(getHintRegion([]));
            assert.isNull(getHintRegion([createCell(0, 0), createCell(4, 8)]));
        })
    );

    it.effect('names the first deduction elimination target instead of the chain placement', () =>
        Effect.sync(() => {
            const engine = new FieldEngine({
                sudokuString: '.....3...9....6......4...371..2..8..........5.8453.......3..67..27...........891.',
                difficulty: DifficultyEnum.Medium
            });

            for (let hintIndex = 0; hintIndex < forcingHintIndex; hintIndex += 1) {
                const script = findHintStepScript(engine.Sudoku, engine.getSnapshot().eliminatedCandidates);

                assert(script !== null, 'Expected a progressing hint');
                engine.startStepScript(script);
                engine.applyStepScript();
            }

            const script = findHintStepScript(engine.Sudoku, engine.getSnapshot().eliminatedCandidates);

            assert(script !== null, 'Expected an elimination-then-placement hint');

            const firstReveal = script.steps.find(step => step.kind === StepScriptStepKindEnum.RevealCandidates);
            const firstStrike = script.steps.find(step => step.kind === StepScriptStepKindEnum.StrikeCandidates);

            assert(firstReveal !== undefined && firstStrike !== undefined, 'Expected an elimination deduction');
            assert.isUndefined(firstReveal.narration.placement);
            assert(script.placement !== undefined, 'Expected a chain placement');

            const [targetElimination] = firstStrike.eliminations;
            const techniqueState = buildStepScriptState(script, 0, HintLevelEnum.TECHNIQUE);

            assert.deepEqual(techniqueState.hintRegion, getHintRegion(firstReveal.patternCells, targetElimination.cell));
            assert.notDeepEqual(techniqueState.hintRegion, getHintRegion(firstReveal.patternCells, script.placement.cell));
            assert.deepEqual(techniqueState.hintRegion, {
                kind: HintRegionKindEnum.CELL,
                number: Math.floor(targetElimination.cell.y / 3) * 3 + Math.floor(targetElimination.cell.x / 3) + 1,
                cell: targetElimination.cell
            });
            assert.deepEqual(techniqueState.regionCellKeys, new Set([getCellKey(targetElimination.cell)]));
        })
    );

    it.effect('names the target cell when pattern cells span regions', () =>
        Effect.sync(() => {
            assert.deepEqual(getHintRegion([createCell(0, 0), createCell(4, 8)], createCell(6, 2)), {
                kind: HintRegionKindEnum.CELL,
                number: 7,
                cell: createCell(6, 2)
            });
            assert.deepEqual(getHintRegion([createCell(1, 1)], createCell(1, 1)), {
                kind: HintRegionKindEnum.CELL,
                number: 1,
                cell: createCell(1, 1)
            });
        })
    );
});

describe('technique level region highlight', () => {
    const findHiddenSingleScript = (sudokuString: string, isUnit: (cells: readonly CellInterface[]) => boolean): StepScriptInterface => {
        const engine = new FieldEngine({ sudokuString, difficulty: DifficultyEnum.Hard });
        const [hiddenSingleStrategy] = createTechniqueStrategies().filter(
            strategy => strategy.technique === SolutionTechniqueEnum.HiddenSingle
        );
        const hiddenSingle = hiddenSingleStrategy
            .find(CandidateContext.fromSudoku(engine.Sudoku))
            .find(result => isUnit(result.reasonCells));

        assert(hiddenSingle !== undefined, 'Expected a hidden single');

        return techniqueResultToStepScript(hiddenSingle);
    };

    it.effect('highlights every cell of the named row, column, or box', () =>
        Effect.sync(() => {
            const rowScript = findHiddenSingleScript(nakedPairBoard, cells => cells.every(cell => cell.y === cells[0].y));
            const columnScript = findHiddenSingleScript(nakedPairBoard, cells => cells.every(cell => cell.x === cells[0].x));
            const boxScript = findHiddenSingleScript(hiddenSingleBoard, cells => cells.every(cell => cell.group === cells[0].group));
            const rowState = buildStepScriptState(rowScript, 0, HintLevelEnum.TECHNIQUE);
            const columnState = buildStepScriptState(columnScript, 0, HintLevelEnum.TECHNIQUE);
            const boxState = buildStepScriptState(boxScript, 0, HintLevelEnum.TECHNIQUE);

            assert.deepEqual(rowState.regionCellKeys, new Set(rowScript.patternCells.map(getCellKey)));
            assert.strictEqual(rowState.hintRegion?.kind, HintRegionKindEnum.ROW);
            assert.deepEqual(columnState.regionCellKeys, new Set(columnScript.patternCells.map(getCellKey)));
            assert.strictEqual(columnState.hintRegion?.kind, HintRegionKindEnum.COLUMN);
            assert.deepEqual(boxState.hintRegion, { kind: HintRegionKindEnum.BOX, number: 8 });
            assert.deepEqual(boxState.regionCellKeys, new Set(['6-3', '6-4', '6-5', '7-3', '7-4', '7-5', '8-3', '8-4', '8-5']));
            assert.strictEqual(buildStepScriptState(boxScript, 0, HintLevelEnum.PATTERN).regionCellKeys.size, 0);
            assert.deepEqual(buildStepScriptState(boxScript, 0).hintRegion, boxState.hintRegion);
            assert.isNull(buildStepScriptState(null, 0, HintLevelEnum.TECHNIQUE).hintRegion);
            assert.strictEqual(buildStepScriptState(null, 0, HintLevelEnum.TECHNIQUE).regionCellKeys.size, 0);
        })
    );
});
