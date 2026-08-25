import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { SolutionTechniqueEnum, TechniqueManager, createTechniqueStrategies } from '@suuudokuuu/techniques';

import { StepScriptStepKindEnum } from '../enums/step-script-step-kind.enum';

import { techniqueResultToStepScript } from './technique-result-to-step-script.util';

import type { TechniqueResultInterface } from '@suuudokuuu/techniques';

const hiddenSingleBoard = [
    '.3.678912',
    '672.95348',
    '1983425.7',
    '8597.142.',
    '.268537.1',
    '7.3924856',
    '961537284',
    '287419635',
    '34.286179'
];

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
];

const pointingPairBoard = [
    '534678912',
    '672195348',
    '.9834.567',
    '85.761423',
    '42685379.',
    '..392485.',
    '961537284',
    '2.7419635',
    '3.5286179'
];

const findResult = (board: string[], technique: SolutionTechniqueEnum): TechniqueResultInterface => {
    const sudoku = Sudoku.fromStrings({ ...defaultSudokuConfig }, ...board);
    const strategies = createTechniqueStrategies().filter(strategy => strategy.technique === technique);
    const result = new TechniqueManager(sudoku, strategies).findNextStep();

    if (result === null) {
        throw new Error('Expected the narrowed registry to find a technique result');
    }

    return result;
};

describe('techniqueResultToStepScript', () => {
    it('maps a placement technique into highlight, reveal and place steps', () => {
        expect.assertions(5);

        const result = findResult(hiddenSingleBoard, SolutionTechniqueEnum.HiddenSingle);
        const script = techniqueResultToStepScript(result);

        expect(script.technique).toBe(SolutionTechniqueEnum.HiddenSingle);
        expect(script.steps.map(step => step.kind)).toEqual([
            StepScriptStepKindEnum.Highlight,
            StepScriptStepKindEnum.RevealCandidates,
            StepScriptStepKindEnum.PlaceValue
        ]);
        expect(script.eliminations).toEqual([]);
        expect(script.placement).toEqual({ cell: result.cell, value: result.value });
        expect(script.patternCells).toEqual(result.reasonCells);
    });

    it('carries a structured narration payload instead of prose', () => {
        expect.assertions(2);

        const result = findResult(hiddenSingleBoard, SolutionTechniqueEnum.HiddenSingle);
        const [highlightStep] = techniqueResultToStepScript(result).steps;

        expect(highlightStep.narration).toEqual({
            technique: SolutionTechniqueEnum.HiddenSingle,
            cells: result.reasonCells,
            values: [result.value]
        });
        expect(highlightStep.kind).toBe(StepScriptStepKindEnum.Highlight);
    });

    it('maps an elimination technique into a strike step without a placement', () => {
        expect.assertions(4);

        const result = findResult(nakedPairBoard, SolutionTechniqueEnum.NakedPair);
        const script = techniqueResultToStepScript(result);

        expect(script.technique).toBe(SolutionTechniqueEnum.NakedPair);
        expect(script.steps.map(step => step.kind)).toEqual([
            StepScriptStepKindEnum.Highlight,
            StepScriptStepKindEnum.RevealCandidates,
            StepScriptStepKindEnum.StrikeCandidates
        ]);
        expect(script.placement).toBeUndefined();
        expect(script.eliminations).toEqual(result.eliminations.map(elimination => ({ cell: elimination.cell, value: elimination.value })));
    });

    it('reveals the eliminated values on the pattern cells of a pattern technique', () => {
        expect.assertions(3);

        const result = findResult(pointingPairBoard, SolutionTechniqueEnum.PointingPair);
        const script = techniqueResultToStepScript(result);
        const [, revealStep, strikeStep] = script.steps;

        expect(script.technique).toBe(SolutionTechniqueEnum.PointingPair);
        expect(revealStep).toEqual({
            kind: StepScriptStepKindEnum.RevealCandidates,
            patternCells: result.reasonCells,
            values: [result.value],
            narration: { technique: SolutionTechniqueEnum.PointingPair, cells: result.reasonCells, values: [result.value] }
        });
        expect(strikeStep.narration.cells).toEqual(result.eliminations.map(elimination => elimination.cell));
    });

    it('keeps a guess result playable as a placement script', () => {
        expect.assertions(2);

        const result = findResult(hiddenSingleBoard, SolutionTechniqueEnum.Guess);
        const script = techniqueResultToStepScript(result);

        expect(script.technique).toBe(SolutionTechniqueEnum.Guess);
        expect(script.placement).toEqual({ cell: result.cell, value: result.value });
    });
});
