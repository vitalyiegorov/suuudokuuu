import { StepScriptStepKindEnum, getCellKey } from '@suuudokuuu/field-core';

import { isDefined } from '@rnw-community/shared';

import { mergeCandidateValues } from './merge-candidate-values.util';

import type { FieldStepStateInterface } from '../interfaces/field-step-state.interface';
import type { StepScriptInterface, StepScriptStepType } from '@suuudokuuu/field-core';

const addCandidateValues = (target: Map<string, number[]>, cellKey: string, values: number[]): void => {
    target.set(cellKey, mergeCandidateValues(target.get(cellKey) ?? [], values));
};

const collectPatternCellKeys = (steps: StepScriptStepType[]): ReadonlySet<string> => {
    const patternCellKeys = new Set<string>();

    for (const step of steps) {
        if (step.kind === StepScriptStepKindEnum.Highlight || step.kind === StepScriptStepKindEnum.RevealCandidates) {
            for (const cell of step.patternCells) {
                patternCellKeys.add(getCellKey(cell));
            }
        }
    }

    return patternCellKeys;
};

const collectRevealedCandidates = (steps: StepScriptStepType[]): ReadonlyMap<string, number[]> => {
    const revealedCandidates = new Map<string, number[]>();

    for (const step of steps) {
        if (step.kind === StepScriptStepKindEnum.RevealCandidates) {
            for (const cell of step.patternCells) {
                addCandidateValues(revealedCandidates, getCellKey(cell), step.values);
            }
        }
    }

    return revealedCandidates;
};

const collectEliminatedCandidates = (steps: StepScriptStepType[]): ReadonlyMap<string, number[]> => {
    const eliminatedCandidates = new Map<string, number[]>();

    for (const step of steps) {
        if (step.kind === StepScriptStepKindEnum.StrikeCandidates) {
            for (const elimination of step.eliminations) {
                addCandidateValues(eliminatedCandidates, getCellKey(elimination.cell), [elimination.value]);
            }
        }
    }

    return eliminatedCandidates;
};

const collectPlacedValues = (steps: StepScriptStepType[]): ReadonlyMap<string, number> => {
    const placedValues = new Map<string, number>();

    for (const step of steps) {
        if (step.kind === StepScriptStepKindEnum.PlaceValue) {
            placedValues.set(getCellKey(step.placement.cell), step.placement.value);
        }
    }

    return placedValues;
};

export const buildFieldStepState = (stepScript: StepScriptInterface | null, stepIndex: number): FieldStepStateInterface => {
    const steps = isDefined(stepScript) ? stepScript.steps.slice(0, stepIndex + 1) : [];
    const placement = stepScript?.placement;

    return {
        patternCellKeys: collectPatternCellKeys(steps),
        targetCellKey: isDefined(placement) ? getCellKey(placement.cell) : null,
        revealedCandidates: collectRevealedCandidates(steps),
        eliminatedCandidates: collectEliminatedCandidates(steps),
        placedValues: collectPlacedValues(steps)
    };
};
