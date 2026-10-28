import { defaultSudokuConfig } from '@suuudokuuu/generator';
import { ForcingOutcomeKindEnum } from '@suuudokuuu/techniques';

import { isDefined, isNotEmptyArray } from '@rnw-community/shared';

import { getCellKey } from '../../@generic/utils/get-cell-key.util';
import { HintLevelEnum } from '../enums/hint-level.enum';
import { HintRegionKindEnum } from '../enums/hint-region-kind.enum';
import { StepScriptStepKindEnum } from '../enums/step-script-step-kind.enum';

import { getDeductionRegion } from './get-deduction-region.util';
import { getStepLinkCount } from './get-step-link-count.util';

import type { HintRegionInterface } from '../interfaces/hint-region.interface';
import type { StepScriptRevealCandidatesStepInterface } from '../interfaces/step-script-reveal-candidates-step.interface';
import type { StepScriptStateInterface } from '../interfaces/step-script-state.interface';
import type { StepScriptInterface } from '../interfaces/step-script.interface';
import type { StepScriptStepType } from '../types/step-script-step.type';
import type { CellInterface } from '@suuudokuuu/generator';

const addCandidateValues = (target: Map<string, number[]>, cellKey: string, values: number[]): void => {
    const mergedValues = [...new Set([...(target.get(cellKey) ?? []), ...values])].sort((left, right) => left - right);

    target.set(cellKey, mergedValues);
};

const collectRevealedCandidates = (
    revealStep: StepScriptStepType | undefined,
    patternCellKeys: ReadonlySet<string>
): ReadonlyMap<string, number[]> => {
    const revealedCandidates = new Map<string, number[]>();

    if (revealStep?.kind === StepScriptStepKindEnum.RevealCandidates) {
        for (const candidate of revealStep.candidates.filter(({ cell }) => patternCellKeys.has(getCellKey(cell)))) {
            addCandidateValues(revealedCandidates, getCellKey(candidate.cell), [candidate.value]);
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
    if (step.kind === StepScriptStepKindEnum.SHOW_CHAIN) {
        return [step.chain[0], step.chain[step.chain.length - 1]].filter(isDefined).map(candidate => candidate.cell);
    }

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

const isWitnessStep = (step: StepScriptStepType | undefined): boolean =>
    step?.kind === StepScriptStepKindEnum.SHOW_CHAIN || step?.kind === StepScriptStepKindEnum.SHOW_BRANCH;

const getDeductionStartIndex = (steps: readonly StepScriptStepType[], revealIndex: number): number =>
    revealIndex > 0 && isWitnessStep(steps[revealIndex - 1]) ? getDeductionStartIndex(steps, revealIndex - 1) : revealIndex;

const getDeductionPatternCells = (steps: readonly StepScriptStepType[], revealIndex: number): CellInterface[] => {
    const revealStep = steps.at(revealIndex);
    const witnessCells = steps.slice(getDeductionStartIndex(steps, revealIndex), revealIndex).flatMap(getWitnessCells);

    if (isNotEmptyArray(witnessCells)) {
        return witnessCells;
    }

    return revealStep?.kind === StepScriptStepKindEnum.RevealCandidates ? revealStep.patternCells : [];
};

const getUnitCellKeys = (steps: readonly StepScriptStepType[], revealIndex: number): string[] =>
    ((revealIndex < 0 ? null : steps.at(revealIndex))?.narration.unitCells ?? []).map(getCellKey);

export const buildStepScriptState = (
    stepScript: StepScriptInterface | null,
    stepIndex: number,
    hintLevel = HintLevelEnum.WALKTHROUGH,
    revealedImplicationCount = Number.POSITIVE_INFINITY
): StepScriptStateInterface => {
    const scriptSteps = stepScript?.steps ?? [];
    const firstRevealIndex = scriptSteps.findIndex(isRevealStep);
    const hintRegion = getDeductionRegion(scriptSteps, firstRevealIndex);
    const emptyState: StepScriptStateInterface = {
        hintRegion,
        regionCellKeys: new Set(),
        candidateCellKeys: new Set(),
        revealedImplicationCount: 0,
        patternCellKeys: new Set(),
        targetCellKey: null,
        revealedCandidates: new Map(),
        eliminatedCandidates: new Map(),
        placedValues: new Map()
    };

    if (hintLevel === HintLevelEnum.TECHNIQUE) {
        return {
            ...emptyState,
            regionCellKeys: new Set(isDefined(hintRegion) ? getRegionCells(hintRegion).map(getCellKey) : []),
            candidateCellKeys: new Set(getUnitCellKeys(scriptSteps, firstRevealIndex))
        };
    }

    if (hintLevel === HintLevelEnum.PATTERN) {
        const patternCellKeys = new Set(getDeductionPatternCells(scriptSteps, firstRevealIndex).map(getCellKey));

        return {
            ...emptyState,
            patternCellKeys,
            candidateCellKeys: new Set([...patternCellKeys, ...getUnitCellKeys(scriptSteps, firstRevealIndex)])
        };
    }

    const currentStep = scriptSteps.at(stepIndex);

    if (currentStep?.kind === StepScriptStepKindEnum.SHOW_CHAIN || currentStep?.kind === StepScriptStepKindEnum.SHOW_BRANCH) {
        const linkCount = getStepLinkCount(currentStep);
        const revealedLinkCount = Math.min(revealedImplicationCount, linkCount);
        const outcomeCells = revealedLinkCount === linkCount ? getWitnessCells(currentStep) : [];

        return {
            ...emptyState,
            explanation: currentStep,
            candidateCellKeys: new Set([...currentStep.narration.cells.slice(0, revealedLinkCount + 1), ...outcomeCells].map(getCellKey)),
            revealedImplicationCount: revealedLinkCount
        };
    }

    const steps = scriptSteps.slice(0, stepIndex + 1);
    const placement = steps.find(step => isDefined(step.narration.placement))?.narration.placement;
    const revealIndex = steps.reduce((lastRevealIndex, step, index) => (isRevealStep(step) ? index : lastRevealIndex), -1);
    const patternCellKeys = new Set(getDeductionPatternCells(steps, revealIndex).map(getCellKey));
    const targetCellKey = isDefined(placement) ? getCellKey(placement.cell) : null;
    const revealedCandidates = collectRevealedCandidates(steps.at(revealIndex), patternCellKeys);
    const eliminatedCandidates = collectEliminatedCandidates(steps);

    return {
        ...emptyState,
        patternCellKeys,
        candidateCellKeys: new Set([
            ...patternCellKeys,
            ...getUnitCellKeys(steps, revealIndex),
            ...revealedCandidates.keys(),
            ...eliminatedCandidates.keys(),
            ...(isDefined(targetCellKey) ? [targetCellKey] : [])
        ]),
        targetCellKey,
        revealedCandidates,
        eliminatedCandidates,
        placedValues: collectPlacedValues(steps)
    };
};
