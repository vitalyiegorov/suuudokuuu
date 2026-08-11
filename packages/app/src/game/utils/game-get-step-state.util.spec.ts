import { describe, expect, it } from '@jest/globals';
import { StepScriptStepKindEnum } from '@suuudokuuu/field-core';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { gameGetStepState } from './game-get-step-state.util';

import type { StepScriptInterface } from '@suuudokuuu/field-core';

const patternCellOne = { x: 1, y: 0, value: 0, group: 0 };
const patternCellTwo = { x: 2, y: 0, value: 0, group: 0 };
const eliminationCell = { x: 4, y: 0, value: 0, group: 1 };
const placementCell = { x: 8, y: 8, value: 0, group: 8 };

const technique = SolutionTechniqueEnum.NakedPair;

const stepScript: StepScriptInterface = {
    technique,
    patternCells: [patternCellOne, patternCellTwo],
    eliminations: [
        { cell: eliminationCell, value: 3 },
        { cell: eliminationCell, value: 7 }
    ],
    placement: { cell: placementCell, value: 5 },
    steps: [
        {
            kind: StepScriptStepKindEnum.Highlight,
            patternCells: [patternCellOne, patternCellTwo],
            narration: { technique, cells: [patternCellOne, patternCellTwo], values: [3, 7] }
        },
        {
            kind: StepScriptStepKindEnum.RevealCandidates,
            patternCells: [patternCellOne, patternCellTwo],
            values: [7, 3],
            narration: { technique, cells: [patternCellOne, patternCellTwo], values: [3, 7] }
        },
        {
            kind: StepScriptStepKindEnum.StrikeCandidates,
            eliminations: [
                { cell: eliminationCell, value: 3 },
                { cell: eliminationCell, value: 7 }
            ],
            narration: { technique, cells: [eliminationCell], values: [3, 7] }
        },
        {
            kind: StepScriptStepKindEnum.PlaceValue,
            placement: { cell: placementCell, value: 5 },
            narration: { technique, cells: [placementCell], values: [5] }
        }
    ]
};

describe('gameGetStepState', () => {
    it('should return an empty state when no script is playing', () => {
        expect.assertions(4);

        const stepState = gameGetStepState(null, 0);

        expect(stepState.patternCellKeys.size).toBe(0);
        expect(stepState.targetCellKey).toBeNull();
        expect(stepState.revealedCandidates.size).toBe(0);
        expect(stepState.eliminatedCandidates.size).toBe(0);
    });

    it('should expose only the pattern cells on the first step', () => {
        expect.assertions(4);

        const stepState = gameGetStepState(stepScript, 0);

        expect([...stepState.patternCellKeys]).toStrictEqual(['0-1', '0-2']);
        expect(stepState.revealedCandidates.size).toBe(0);
        expect(stepState.eliminatedCandidates.size).toBe(0);
        expect(stepState.targetCellKey).toBe('8-8');
    });

    it('should reveal the pattern candidates sorted on the reveal step', () => {
        expect.assertions(2);

        const stepState = gameGetStepState(stepScript, 1);

        expect(stepState.revealedCandidates.get('0-1')).toStrictEqual([3, 7]);
        expect(stepState.eliminatedCandidates.size).toBe(0);
    });

    it('should accumulate eliminations per cell on the strike step', () => {
        expect.assertions(1);

        const stepState = gameGetStepState(stepScript, 2);

        expect(stepState.eliminatedCandidates.get('0-4')).toStrictEqual([3, 7]);
    });

    it('should keep the whole pattern visible on the final step', () => {
        expect.assertions(3);

        const stepState = gameGetStepState(stepScript, 3);

        expect([...stepState.patternCellKeys]).toStrictEqual(['0-1', '0-2']);
        expect(stepState.revealedCandidates.get('0-2')).toStrictEqual([3, 7]);
        expect(stepState.targetCellKey).toBe('8-8');
    });

    it('should report no target cell for an elimination-only script', () => {
        expect.assertions(1);

        const eliminationScript: StepScriptInterface = {
            technique,
            patternCells: stepScript.patternCells,
            eliminations: stepScript.eliminations,
            steps: stepScript.steps.slice(0, 3)
        };

        expect(gameGetStepState(eliminationScript, 2).targetCellKey).toBeNull();
    });
});
