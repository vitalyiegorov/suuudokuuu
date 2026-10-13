import { defaultSudokuConfig } from '@suuudokuuu/generator';
import { ForcingOutcomeKindEnum } from '@suuudokuuu/techniques';

import { isDefined, isNotEmptyArray } from '@rnw-community/shared';

import { getCellKey } from '../../@generic/utils/get-cell-key.util';
import { HintLevelEnum } from '../enums/hint-level.enum';
import { HintRegionKindEnum } from '../enums/hint-region-kind.enum';
import { StepScriptStepKindEnum } from '../enums/step-script-step-kind.enum';

import { getHintRegion } from './get-hint-region.util';
import { getStepLinkCount } from './get-step-link-count.util';

import type { HintRegionInterface } from '../interfaces/hint-region.interface';
import type { StepScriptRevealCandidatesStepInterface } from '../interfaces/step-script-reveal-candidates-step.interface';
import type { StepScriptStateInterface } from '../interfaces/step-script-state.interface';
import type { StepScriptStrikeCandidatesStepInterface } from '../interfaces/step-script-strike-candidates-step.interface';
import type { StepScriptInterface } from '../interfaces/step-script.interface';
import type { StepScriptStepType } from '../types/step-script-step.type';
import type { CellInterface } from '@suuudokuuu/generator';

const addCandidateValues = (target: Map<string, number[]>, cellKey: string, values: number[]): void => {
    const mergedValues = [...new Set([...(target.get(cellKey) ?? []), ...values])].sort((left, right) => left - right);

    target.set(cellKey, mergedValues);
};

const collectPatternCellKeys = (steps: readonly StepScriptStepType[]): ReadonlySet<string> => {
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

const collectRevealedCandidates = (steps: readonly StepScriptStepType[]): ReadonlyMap<string, number[]> => {
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

const collectEliminatedCandidates = (steps: readonly StepScriptStepType[]): ReadonlyMap<string, number[]> => {
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

const collectPlacedValues = (steps: readonly StepScriptStepType[]): ReadonlyMap<string, number> => {
    const placedValues = new Map<string, number>();

    for (const step of steps) {
        if (step.kind === StepScriptStepKindEnum.PlaceValue) {
            placedValues.set(getCellKey(step.placement.cell), step.placement.value);
        }
    }

    return placedValues;
};

const { fieldGroupHeight, fieldGroupWidth, fieldSize } = defaultSudokuConfig;

const isRevealStep = (step: StepScriptStepType): step is StepScriptRevealCandidatesStepInterface =>
    step.kind === StepScriptStepKindEnum.RevealCandidates;

const isStrikeStep = (step: StepScriptStepType): step is StepScriptStrikeCandidatesStepInterface =>
    step.kind === StepScriptStepKindEnum.StrikeCandidates;

const getRegionCells = (region: HintRegionInterface): Pick<CellInterface, 'x' | 'y'>[] => {
    const lineIndex = region.number - 1;
    const positions = Array.from({ length: fieldSize }, (_, position) => position);
    const boxesPerRow = fieldSize / fieldGroupWidth;

    if (region.kind === HintRegionKindEnum.ROW) {
        return positions.map(x => ({ x, y: lineIndex }));
    }

    if (region.kind === HintRegionKindEnum.COLUMN) {
        return positions.map(y => ({ x: lineIndex, y }));
    }

    if (region.kind === HintRegionKindEnum.BOX) {
        return positions.map(position => ({
            x: (lineIndex % boxesPerRow) * fieldGroupWidth + (position % fieldGroupWidth),
            y: Math.floor(lineIndex / boxesPerRow) * fieldGroupHeight + Math.floor(position / fieldGroupWidth)
        }));
    }

    return isDefined(region.cell) ? [region.cell] : [];
};

const getWitnessCells = (step: StepScriptStepType): CellInterface[] => {
    if (step.kind !== StepScriptStepKindEnum.SHOW_BRANCH) {
        return [];
    }

    const { assumption, outcome } = step.branch;

    return [
        assumption.cell,
        ...step.outcomeCells,
        ...step.outcomeCandidates.map(candidate => candidate.cell),
        ...(outcome.kind === ForcingOutcomeKindEnum.COMMON_PLACEMENT ? [outcome.cell] : [])
    ];
};

const getFirstDeductionRegion = (steps: readonly StepScriptStepType[]): HintRegionInterface | null => {
    const revealIndex = steps.findIndex(isRevealStep);
    const revealStep = steps.find(isRevealStep);

    if (!isDefined(revealStep)) {
        return null;
    }

    const eliminationCell = steps.slice(revealIndex).find(isStrikeStep)?.eliminations.at(0)?.cell;

    return getHintRegion(revealStep.patternCells, revealStep.narration.placement?.cell ?? eliminationCell);
};

const getFirstDeductionPatternCells = (steps: readonly StepScriptStepType[]): CellInterface[] => {
    const revealIndex = steps.findIndex(isRevealStep);
    const witnessCells = steps.slice(0, Math.max(revealIndex, 0)).flatMap(getWitnessCells);

    return isNotEmptyArray(witnessCells) ? witnessCells : (steps.find(isRevealStep)?.patternCells ?? []);
};

export const buildStepScriptState = (
    stepScript: StepScriptInterface | null,
    stepIndex: number,
    hintLevel = HintLevelEnum.WALKTHROUGH,
    revealedImplicationCount = Number.POSITIVE_INFINITY
): StepScriptStateInterface => {
    const scriptSteps = stepScript?.steps ?? [];
    const hintRegion = getFirstDeductionRegion(scriptSteps);
    const emptyState: StepScriptStateInterface = {
        hintRegion,
        regionCellKeys: new Set(),
        revealedImplicationCount: 0,
        patternCellKeys: new Set(),
        targetCellKey: null,
        revealedCandidates: new Map(),
        eliminatedCandidates: new Map(),
        placedValues: new Map()
    };

    if (hintLevel === HintLevelEnum.TECHNIQUE) {
        return { ...emptyState, regionCellKeys: new Set(isDefined(hintRegion) ? getRegionCells(hintRegion).map(getCellKey) : []) };
    }

    if (hintLevel === HintLevelEnum.PATTERN) {
        return { ...emptyState, patternCellKeys: new Set(getFirstDeductionPatternCells(scriptSteps).map(getCellKey)) };
    }

    const currentStep = scriptSteps.at(stepIndex);

    if (currentStep?.kind === StepScriptStepKindEnum.SHOW_CHAIN || currentStep?.kind === StepScriptStepKindEnum.SHOW_BRANCH) {
        return {
            ...emptyState,
            explanation: currentStep,
            revealedImplicationCount: Math.min(revealedImplicationCount, getStepLinkCount(currentStep))
        };
    }

    const steps = scriptSteps.slice(0, stepIndex + 1);
    const placement = steps.find(step => isDefined(step.narration.placement))?.narration.placement;

    return {
        ...emptyState,
        patternCellKeys: collectPatternCellKeys(steps),
        targetCellKey: isDefined(placement) ? getCellKey(placement.cell) : null,
        revealedCandidates: collectRevealedCandidates(steps),
        eliminatedCandidates: collectEliminatedCandidates(steps),
        placedValues: collectPlacedValues(steps)
    };
};
