import { DifficultyEnum, Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { ForcingOutcomeKindEnum, SolutionTechniqueEnum, TechniqueManager, createTechniqueStrategies } from '@suuudokuuu/techniques';
import { describe, expect, it } from 'vitest';

import { FieldEngine } from '../../../src/field-engine/classes/field-engine';
import { StepScriptStepKindEnum } from '../../../src/step-script/enums/step-script-step-kind.enum';
import { buildStepScriptState } from '../../../src/step-script/utils/build-step-script-state.util';
import { findHintStepScript } from '../../../src/step-script/utils/find-hint-step-script.util';
import { techniqueResultToStepScript } from '../../../src/step-script/utils/technique-result-to-step-script.util';

import type { StepScriptInterface } from '../../../src/step-script/interfaces/step-script.interface';
import type { StepScriptStepType } from '../../../src/step-script/types/step-script-step.type';
import type { TechniqueResultInterface } from '@suuudokuuu/techniques';

const board = '000000051000000023004005000000000600000130000007680000429006500370400000810000000';
const columnQuadBoard = '.....3...9....6......4...371..2..8..........5.8453.......3..67..27...........891.';

const findResult = (technique: SolutionTechniqueEnum): TechniqueResultInterface => {
    const strategies = createTechniqueStrategies().filter(strategy => strategy.technique === technique);
    const result = new TechniqueManager(Sudoku.fromString(board, defaultSudokuConfig), strategies).findNextStep();

    if (result === null) {
        throw new Error(`Expected a ${technique} result`);
    }

    return result;
};

const findHint = (engine: FieldEngine): StepScriptInterface => {
    const script = findHintStepScript(engine.Sudoku);

    if (script === null) {
        throw new Error('Expected a hint step script');
    }

    return script;
};

const isWitnessStep = (step: StepScriptStepType): boolean =>
    step.kind === StepScriptStepKindEnum.SHOW_CHAIN || step.kind === StepScriptStepKindEnum.SHOW_BRANCH;

const getNarratedCandidates = (step: StepScriptStepType): number[][] =>
    step.narration.cells.map((cell, index) => [cell.y, cell.x, step.narration.values[index]]);

describe('structured witness playback', () => {
    it.each([SolutionTechniqueEnum.AIC, SolutionTechniqueEnum.NishioForcingChain, SolutionTechniqueEnum.CellForcingChain])(
        'plays one %s witness slide per chain or branch before the unchanged deduction slides',
        technique => {
            const result = findResult(technique);
            const { branches = [], chain } = result;
            const script = techniqueResultToStepScript(result);
            const expectedWitnessSteps = [
                ...(chain ? [{ kind: StepScriptStepKindEnum.SHOW_CHAIN, chain }] : []),
                ...branches.map((branch, branchIndex) => ({
                    kind: StepScriptStepKindEnum.SHOW_BRANCH,
                    branch,
                    branchIndex,
                    branchCount: branches.length
                }))
            ];

            expect(expectedWitnessSteps.length).toBeGreaterThan(0);
            expect(script.steps.slice(0, expectedWitnessSteps.length)).toMatchObject(expectedWitnessSteps);
            expect(script.steps.slice(expectedWitnessSteps.length).some(isWitnessStep)).toBe(false);
            expect(script.eliminations).toEqual(result.eliminations);
        }
    );

    it('shows only the current witness slide and restores the deduction overlay after it', () => {
        const script = techniqueResultToStepScript(findResult(SolutionTechniqueEnum.CellForcingChain));
        const revealIndex = script.steps.findIndex(step => !isWitnessStep(step));

        expect(buildStepScriptState(script, 1)).toEqual({
            explanation: script.steps[1],
            patternCellKeys: new Set(),
            targetCellKey: null,
            revealedCandidates: new Map(),
            eliminatedCandidates: new Map(),
            placedValues: new Map()
        });
        expect(buildStepScriptState(script, revealIndex).explanation).toBeUndefined();
        expect(buildStepScriptState(script, revealIndex).patternCellKeys.size).toBeGreaterThan(0);
    });

    it('walks the Nishio and AIC third hint of the #455 board without writing a hypothesis', () => {
        const engine = new FieldEngine({ sudokuString: columnQuadBoard, difficulty: DifficultyEnum.Medium, showAutoCandidates: true });

        engine.startStepScript(findHint(engine));
        engine.applyStepScript();
        engine.startStepScript(findHint(engine));
        engine.applyStepScript();

        const script = findHint(engine);
        const before = engine.serialize();
        const control = new FieldEngine(before);
        const nishio = script.steps.find(step => step.kind === StepScriptStepKindEnum.SHOW_BRANCH);
        const aic = script.steps.find(step => step.kind === StepScriptStepKindEnum.SHOW_CHAIN);

        expect(nishio?.narration.technique).toBe(SolutionTechniqueEnum.NishioForcingChain);
        expect(nishio && getNarratedCandidates(nishio)).toEqual([
            [7, 3, 6],
            [8, 3, 7],
            [1, 3, 1],
            [0, 3, 8],
            [4, 3, 9],
            [4, 4, 8],
            [7, 5, 9],
            [5, 8, 1],
            [5, 5, 7]
        ]);
        expect(nishio).toMatchObject({ branch: { outcome: { kind: ForcingOutcomeKindEnum.EMPTY_CELL, cell: { y: 5, x: 6 } } } });
        expect(aic?.narration.technique).toBe(SolutionTechniqueEnum.AIC);
        expect(script.placement).toMatchObject({ cell: { y: 5, x: 8 }, value: 1 });

        engine.startStepScript(script);

        while (engine.stepScriptNext()) {
            expect(engine.serialize()).toEqual(before);
        }

        engine.applyStepScript();
        control.startStepScript({ ...script, steps: script.steps.filter(step => !isWitnessStep(step)) });
        control.applyStepScript();

        expect(engine.serialize()).toEqual(control.serialize());
    });
});
