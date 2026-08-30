import { isDefined } from '@rnw-community/shared';

import { getCellKey } from '../../@generic/utils/get-cell-key.util';
import { StepScriptStepKindEnum } from '../enums/step-script-step-kind.enum';

import type { StepScriptStateInterface } from '../interfaces/step-script-state.interface';
import type { StepScriptInterface } from '../interfaces/step-script.interface';
import type { StepScriptStepType } from '../types/step-script-step.type';

const addCandidateValues = (target: Map<string, number[]>, cellKey: string, values: number[]): void => {
    const mergedValues = [...new Set([...(target.get(cellKey) ?? []), ...values])].sort((left, right) => left - right);

    target.set(cellKey, mergedValues);
};

const collectPatternCellKeys = (steps: StepScriptStepType[]): ReadonlySet<string> => {
    const patternCellKeys = new Set<string>();

    for (const step of steps) {
        if (step.kind === StepScriptStepKindEnum.RevealCandidates) {
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
            for (const candidate of step.candidates) {
                addCandidateValues(revealedCandidates, getCellKey(candidate.cell), [candidate.value]);
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

export const buildStepScriptState = (stepScript: StepScriptInterface | null, stepIndex: number): StepScriptStateInterface => {
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
