import { StepScriptStepKindEnum } from '@suuudokuuu/field-core';

import { isDefined } from '@rnw-community/shared';

import { getCellKey } from '../../@generic/utils/get-cell-key.util';

import { gameMergeCandidateValues } from './game-merge-candidate-values.util';

import type { GameStepStateInterface } from '../interface/game-step-state.interface';
import type { StepScriptInterface, StepScriptStepType } from '@suuudokuuu/field-core';

const addCandidateValues = (target: Map<string, number[]>, cellKey: string, values: number[]): void => {
    target.set(cellKey, gameMergeCandidateValues(target.get(cellKey) ?? [], values));
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

export const gameGetStepState = (stepScript: StepScriptInterface | null, stepIndex: number): GameStepStateInterface => {
    const steps = isDefined(stepScript) ? stepScript.steps.slice(0, stepIndex + 1) : [];
    const placement = stepScript?.placement;

    return {
        patternCellKeys: collectPatternCellKeys(steps),
        targetCellKey: isDefined(placement) ? getCellKey(placement.cell) : null,
        revealedCandidates: collectRevealedCandidates(steps),
        eliminatedCandidates: collectEliminatedCandidates(steps)
    };
};
