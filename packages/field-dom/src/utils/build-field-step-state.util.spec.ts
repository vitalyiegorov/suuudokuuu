import { describe, expect, it } from '@jest/globals';
import { StepScriptStepKindEnum } from '@suuudokuuu/field-core';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { buildFieldStepState } from './build-field-step-state.util';

import type { StepScriptInterface } from '@suuudokuuu/field-core';

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
        { kind: StepScriptStepKindEnum.Highlight, patternCells, narration },
        { kind: StepScriptStepKindEnum.RevealCandidates, patternCells, values: [3, 7], narration },
        { kind: StepScriptStepKindEnum.StrikeCandidates, eliminations: [{ cell: eliminationCell, value: 3 }], narration },
        { kind: StepScriptStepKindEnum.PlaceValue, placement: { cell: placementCell, value: 5 }, narration }
    ]
};

describe('buildFieldStepState', () => {
    it('returns an empty state without a script', () => {
        const stepState = buildFieldStepState(null, 0);

        expect(stepState.patternCellKeys.size).toBe(0);
        expect(stepState.targetCellKey).toBeNull();
        expect(stepState.revealedCandidates.size).toBe(0);
        expect(stepState.eliminatedCandidates.size).toBe(0);
        expect(stepState.placedValues.size).toBe(0);
    });

    it('exposes the placement cell as the target from the first step', () => {
        const stepState = buildFieldStepState(nakedPairScript, 0);

        expect(stepState.targetCellKey).toBe('2-2');
        expect([...stepState.patternCellKeys]).toEqual(['0-0', '0-1']);
        expect(stepState.revealedCandidates.size).toBe(0);
    });

    it('reveals candidates once the reveal step is reached', () => {
        const stepState = buildFieldStepState(nakedPairScript, 1);

        expect(stepState.revealedCandidates.get('0-0')).toEqual([3, 7]);
        expect(stepState.revealedCandidates.get('0-1')).toEqual([3, 7]);
        expect(stepState.eliminatedCandidates.size).toBe(0);
    });

    it('accumulates eliminations and placements up to the current step', () => {
        const stepState = buildFieldStepState(nakedPairScript, 3);

        expect(stepState.eliminatedCandidates.get('0-4')).toEqual([3]);
        expect(stepState.placedValues.get('2-2')).toBe(5);
    });

    it('hides later steps while the player is rewound', () => {
        const stepState = buildFieldStepState(nakedPairScript, 2);

        expect(stepState.eliminatedCandidates.get('0-4')).toEqual([3]);
        expect(stepState.placedValues.size).toBe(0);
    });
});
