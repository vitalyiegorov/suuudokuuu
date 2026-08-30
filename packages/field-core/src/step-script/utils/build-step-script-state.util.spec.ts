import { describe, expect, it } from '@jest/globals';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { StepScriptStepKindEnum } from '../enums/step-script-step-kind.enum';

import { buildStepScriptState } from './build-step-script-state.util';

import type { StepScriptInterface } from '../interfaces/step-script.interface';

const createCell = (y: number, x: number, value = 0) => ({ x, y, value, group: Math.floor(y / 3) * 3 + Math.floor(x / 3) });

const patternCells = [createCell(0, 0), createCell(0, 1)];
const eliminationCell = createCell(0, 4);
const placementCell = createCell(2, 2);
const narration = { technique: SolutionTechniqueEnum.NakedPair, cells: patternCells, values: [3, 7] };

const nakedPairScript: StepScriptInterface = {
    technique: SolutionTechniqueEnum.NakedPair,
    patternCells,
    eliminations: [{ cell: eliminationCell, value: 3 }],
    placement: { cell: placementCell, value: 5 },
    steps: [
        {
            kind: StepScriptStepKindEnum.RevealCandidates,
            patternCells,
            candidates: [...patternCells.map(cell => ({ cell, value: 3 })), ...patternCells.map(cell => ({ cell, value: 7 }))],
            narration
        },
        { kind: StepScriptStepKindEnum.StrikeCandidates, eliminations: [{ cell: eliminationCell, value: 3 }], narration },
        { kind: StepScriptStepKindEnum.PlaceValue, placement: { cell: placementCell, value: 5 }, narration }
    ]
};

describe('buildStepScriptState', () => {
    it('returns an empty state without a script', () => {
        expect.assertions(5);

        const stepState = buildStepScriptState(null, 0);

        expect(stepState.patternCellKeys.size).toBe(0);
        expect(stepState.targetCellKey).toBeNull();
        expect(stepState.revealedCandidates.size).toBe(0);
        expect(stepState.eliminatedCandidates.size).toBe(0);
        expect(stepState.placedValues.size).toBe(0);
    });

    it('exposes the pattern and the placement target from the reveal step', () => {
        expect.assertions(3);

        const stepState = buildStepScriptState(nakedPairScript, 0);

        expect(stepState.targetCellKey).toBe('2-2');
        expect([...stepState.patternCellKeys]).toEqual(['0-0', '0-1']);
        expect(stepState.revealedCandidates.get('0-0')).toEqual([3, 7]);
    });

    it('reveals candidates once the reveal step is reached', () => {
        expect.assertions(3);

        const stepState = buildStepScriptState(nakedPairScript, 0);

        expect(stepState.revealedCandidates.get('0-0')).toEqual([3, 7]);
        expect(stepState.revealedCandidates.get('0-1')).toEqual([3, 7]);
        expect(stepState.eliminatedCandidates.size).toBe(0);
    });

    it('accumulates eliminations and placements up to the current step', () => {
        expect.assertions(2);

        const stepState = buildStepScriptState(nakedPairScript, 2);

        expect(stepState.eliminatedCandidates.get('0-4')).toEqual([3]);
        expect(stepState.placedValues.get('2-2')).toBe(5);
    });

    it('hides later steps while the player is rewound', () => {
        expect.assertions(3);

        const stepState = buildStepScriptState(nakedPairScript, 0);

        expect(stepState.eliminatedCandidates.size).toBe(0);
        expect(stepState.placedValues.size).toBe(0);
        expect(stepState.revealedCandidates.get('0-0')).toEqual([3, 7]);
    });

    it('reports no target cell for an elimination-only script', () => {
        expect.assertions(1);

        const eliminationOnlyScript: StepScriptInterface = {
            technique: SolutionTechniqueEnum.NakedPair,
            patternCells,
            eliminations: nakedPairScript.eliminations,
            steps: nakedPairScript.steps.slice(0, 2)
        };

        expect(buildStepScriptState(eliminationOnlyScript, 1).targetCellKey).toBeNull();
    });

    it('accumulates distinct elimination values per cell across multiple strike steps', () => {
        expect.assertions(1);

        const multiStrikeScript: StepScriptInterface = {
            technique: SolutionTechniqueEnum.NakedPair,
            patternCells,
            eliminations: [
                { cell: eliminationCell, value: 3 },
                { cell: eliminationCell, value: 7 }
            ],
            steps: [
                { kind: StepScriptStepKindEnum.StrikeCandidates, eliminations: [{ cell: eliminationCell, value: 7 }], narration },
                { kind: StepScriptStepKindEnum.StrikeCandidates, eliminations: [{ cell: eliminationCell, value: 3 }], narration }
            ]
        };

        expect(buildStepScriptState(multiStrikeScript, 1).eliminatedCandidates.get('0-4')).toEqual([3, 7]);
    });
});
