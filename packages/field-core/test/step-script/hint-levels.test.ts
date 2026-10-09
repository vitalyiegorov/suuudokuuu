import { DifficultyEnum } from '@suuudokuuu/generator';
import { describe, expect, it } from 'vitest';

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

const nakedPairBoard = [
    '.34.7.91.',
    '672195348',
    '.9.34.567',
    '859761423',
    '426.5379.',
    '713924856',
    '961537284',
    '287419635',
    '345286179'
].join('');

const createCell = (y: number, x: number): CellInterface => ({ x, y, value: 0, group: Math.floor(y / 3) * 3 + Math.floor(x / 3) });

const createHintEngine = (): { engine: FieldEngine; script: StepScriptInterface } => {
    const engine = new FieldEngine({ sudokuString: nakedPairBoard, difficulty: DifficultyEnum.Newbie });
    const script = findStepScript(engine.Sudoku);

    if (script === null) {
        throw new Error('Expected a hint script');
    }

    return { engine, script };
};

describe('progressive hint levels', () => {
    it('starts a plain script at the walkthrough level', () => {
        expect.assertions(1);

        const { engine, script } = createHintEngine();

        engine.startStepScript(script);

        expect(engine.getSnapshot().hintLevel).toBe(HintLevelEnum.WALKTHROUGH);
    });

    it('reveals technique, pattern, then walkthrough, and stops there', () => {
        expect.assertions(6);

        const { engine, script } = createHintEngine();

        engine.startStepScript(script, HintLevelEnum.TECHNIQUE);

        expect(engine.getSnapshot().hintLevel).toBe(HintLevelEnum.TECHNIQUE);
        expect(engine.revealNextHintLevel()).toBe(true);
        expect(engine.getSnapshot().hintLevel).toBe(HintLevelEnum.PATTERN);
        expect(engine.revealNextHintLevel()).toBe(true);
        expect(engine.getSnapshot().hintLevel).toBe(HintLevelEnum.WALKTHROUGH);
        expect(engine.revealNextHintLevel()).toBe(false);
    });

    it('ignores a level request without a running script', () => {
        expect.assertions(1);

        const { engine } = createHintEngine();

        expect(engine.revealNextHintLevel()).toBe(false);
    });

    it('shows strictly more of the same script at every level', () => {
        expect.assertions(7);

        const { script } = createHintEngine();
        const techniqueState = buildStepScriptState(script, 0, HintLevelEnum.TECHNIQUE);
        const patternState = buildStepScriptState(script, 0, HintLevelEnum.PATTERN);
        const walkthroughState = buildStepScriptState(script, 0, HintLevelEnum.WALKTHROUGH);

        expect(techniqueState.patternCellKeys.size).toBe(0);
        expect(patternState.patternCellKeys.size).toBeGreaterThan(0);
        expect(patternState.patternCellKeys).toStrictEqual(new Set(script.patternCells.map(getCellKey)));
        expect(patternState.revealedCandidates.size).toBe(0);
        expect(walkthroughState.revealedCandidates.size).toBeGreaterThan(0);
        expect(walkthroughState.patternCellKeys).toStrictEqual(patternState.patternCellKeys);
        expect(buildStepScriptState(null, 0, HintLevelEnum.PATTERN).patternCellKeys.size).toBe(0);
    });

    it('places the digit only when the script is applied', () => {
        expect.assertions(4);

        const { engine, script } = createHintEngine();
        const { placement } = script;

        engine.startStepScript(script, HintLevelEnum.TECHNIQUE);
        engine.revealNextHintLevel();
        engine.revealNextHintLevel();

        expect(placement).toBeDefined();
        expect(engine.Sudoku.isBlankCell(createCell(placement?.cell.y ?? 0, placement?.cell.x ?? 0))).toBe(true);

        engine.applyStepScript();

        expect(engine.Sudoku.Field[placement?.cell.y ?? 0][placement?.cell.x ?? 0].value).toBe(placement?.value);
        expect(engine.getSnapshot().hintLevel).toBe(HintLevelEnum.WALKTHROUGH);
    });

    it('resets the level when the script stops', () => {
        expect.assertions(2);

        const { engine, script } = createHintEngine();

        engine.startStepScript(script, HintLevelEnum.TECHNIQUE);
        engine.stopStepScript();

        expect(engine.getSnapshot().stepScript).toBeNull();
        expect(engine.getSnapshot().hintLevel).toBe(HintLevelEnum.WALKTHROUGH);
    });

    it('highlights only the first pattern in a multi-technique hint', () => {
        const engine = new FieldEngine({
            sudokuString: '.3.1.......17..63.5..623..1...2...13..38.1..61..3.48..357986142894512367.1.437.8.',
            difficulty: DifficultyEnum.Medium
        });
        const script = findHintStepScript(engine.Sudoku);

        if (script === null) {
            throw new Error('Expected a hint script');
        }

        const firstReveal = script.steps.find(step => step.kind === StepScriptStepKindEnum.RevealCandidates);

        expect(firstReveal?.kind).toBe(StepScriptStepKindEnum.RevealCandidates);
        expect(buildStepScriptState(script, 0, HintLevelEnum.PATTERN).patternCellKeys).toStrictEqual(
            new Set(firstReveal?.kind === StepScriptStepKindEnum.RevealCandidates ? firstReveal.patternCells.map(getCellKey) : [])
        );
        expect(script.patternCells.length).toBeGreaterThan(
            firstReveal?.kind === StepScriptStepKindEnum.RevealCandidates ? firstReveal.patternCells.length : 0
        );
    });
});

describe('getHintRegion', () => {
    it('names a shared row, column, or box', () => {
        expect.assertions(3);

        expect(getHintRegion([createCell(2, 0), createCell(2, 5)])).toStrictEqual({ kind: HintRegionKindEnum.ROW, number: 3 });
        expect(getHintRegion([createCell(0, 5), createCell(7, 5)])).toStrictEqual({ kind: HintRegionKindEnum.COLUMN, number: 6 });
        expect(getHintRegion([createCell(3, 3), createCell(4, 5)])).toStrictEqual({ kind: HintRegionKindEnum.BOX, number: 5 });
    });

    it('names no region for a lone cell or scattered cells', () => {
        expect.assertions(3);

        expect(getHintRegion([createCell(1, 1)])).toBeNull();
        expect(getHintRegion([])).toBeNull();
        expect(getHintRegion([createCell(0, 0), createCell(4, 8)])).toBeNull();
    });

    it('uses the first deduction placement row when pattern cells span regions', () => {
        expect(getHintRegion([createCell(0, 0), createCell(4, 8)], createCell(6, 2))).toStrictEqual({
            kind: HintRegionKindEnum.ROW,
            number: 7
        });
    });
});
