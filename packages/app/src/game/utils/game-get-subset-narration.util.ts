import { msg, plural } from '@lingui/core/macro';
import { HintLevelEnum, HintRegionKindEnum, StepScriptStepKindEnum, getDeductionRegion } from '@suuudokuuu/field-core';

import { isDefined } from '@rnw-community/shared';

import { techniqueNarrationFamilyConstant } from '../constant/technique-narration-family.constant';
import { ListConjunctionEnum } from '../enums/list-conjunction.enum';
import { NarrationFamilyEnum } from '../enums/narration-family.enum';

import { gameFormatList } from './game-format-list.util';
import { gameGetCellName } from './game-get-cell-name.util';

import type { I18n, MessageDescriptor } from '@lingui/core';
import type { StepScriptStepType } from '@suuudokuuu/field-core';

type RegionNudgeType = (regionNumber: number, subsetSize: number) => MessageDescriptor;

type RegionSentenceType = (regionNumber: number, digitList: string, cellList: string) => MessageDescriptor;

const nakedNudges: Partial<Record<HintRegionKindEnum, RegionNudgeType>> = {
    [HintRegionKindEnum.ROW]: (regionNumber, subsetSize) =>
        msg({ message: plural(subsetSize, { other: `Look at row ${regionNumber}: # cells there can hold only the same # digits.` }) }),
    [HintRegionKindEnum.COLUMN]: (regionNumber, subsetSize) =>
        msg({ message: plural(subsetSize, { other: `Look at column ${regionNumber}: # cells there can hold only the same # digits.` }) }),
    [HintRegionKindEnum.BOX]: (regionNumber, subsetSize) =>
        msg({ message: plural(subsetSize, { other: `Look at box ${regionNumber}: # cells there can hold only the same # digits.` }) })
};

const hiddenNudges: Partial<Record<HintRegionKindEnum, RegionNudgeType>> = {
    [HintRegionKindEnum.ROW]: (regionNumber, subsetSize) =>
        msg({ message: plural(subsetSize, { other: `Look at row ${regionNumber}: # digits there fit in only # cells.` }) }),
    [HintRegionKindEnum.COLUMN]: (regionNumber, subsetSize) =>
        msg({ message: plural(subsetSize, { other: `Look at column ${regionNumber}: # digits there fit in only # cells.` }) }),
    [HintRegionKindEnum.BOX]: (regionNumber, subsetSize) =>
        msg({ message: plural(subsetSize, { other: `Look at box ${regionNumber}: # digits there fit in only # cells.` }) })
};

const hiddenPatterns: Partial<Record<HintRegionKindEnum, RegionSentenceType>> = {
    [HintRegionKindEnum.ROW]: (regionNumber, digitList, cellList) => msg`In row ${regionNumber}, ${digitList} fit only in ${cellList}.`,
    [HintRegionKindEnum.COLUMN]: (regionNumber, digitList, cellList) =>
        msg`In column ${regionNumber}, ${digitList} fit only in ${cellList}.`,
    [HintRegionKindEnum.BOX]: (regionNumber, digitList, cellList) => msg`In box ${regionNumber}, ${digitList} fit only in ${cellList}.`
};

const nakedStrikes: Partial<Record<HintRegionKindEnum, RegionSentenceType>> = {
    [HintRegionKindEnum.ROW]: (regionNumber, digitList) => msg`So ${digitList} cannot go anywhere else in row ${regionNumber}.`,
    [HintRegionKindEnum.COLUMN]: (regionNumber, digitList) => msg`So ${digitList} cannot go anywhere else in column ${regionNumber}.`,
    [HintRegionKindEnum.BOX]: (regionNumber, digitList) => msg`So ${digitList} cannot go anywhere else in box ${regionNumber}.`
};

const isRevealStep = (step: StepScriptStepType): boolean => step.kind === StepScriptStepKindEnum.RevealCandidates;

export const gameGetSubsetNarration = (
    steps: readonly StepScriptStepType[],
    stepIndex: number,
    i18n: I18n,
    hintLevel = HintLevelEnum.WALKTHROUGH
): MessageDescriptor | null => {
    const revealIndex = steps.slice(0, stepIndex + 1).findLastIndex(isRevealStep);
    const revealStep = revealIndex < 0 ? null : steps.at(revealIndex);
    const step = steps.at(stepIndex);
    const region = getDeductionRegion(steps, revealIndex);
    const family = isDefined(revealStep) ? techniqueNarrationFamilyConstant[revealStep.narration.technique] : null;
    const isHidden = family === NarrationFamilyEnum.HIDDEN_SUBSET;

    if (!isDefined(revealStep) || !isDefined(step) || !isDefined(region) || (!isHidden && family !== NarrationFamilyEnum.NAKED_SUBSET)) {
        return null;
    }

    const { cells, values } = revealStep.narration;
    const cellList = gameFormatList(cells.map(gameGetCellName), ListConjunctionEnum.AND, i18n);
    const digitList = gameFormatList(values, ListConjunctionEnum.AND, i18n);

    if (hintLevel === HintLevelEnum.TECHNIQUE) {
        return (isHidden ? hiddenNudges : nakedNudges)[region.kind]?.(region.number, cells.length) ?? null;
    }

    if (step.kind === StepScriptStepKindEnum.RevealCandidates) {
        const digitChoice = gameFormatList(values, ListConjunctionEnum.OR, i18n);

        return isHidden
            ? (hiddenPatterns[region.kind]?.(region.number, digitList, cellList) ?? null)
            : msg`${digitList} must go in ${cellList}: those cells can only be ${digitChoice}.`;
    }

    if (step.kind !== StepScriptStepKindEnum.StrikeCandidates) {
        return null;
    }

    return isHidden
        ? msg`So ${cellList} can hold only ${digitList}.`
        : (nakedStrikes[region.kind]?.(region.number, digitList, cellList) ?? null);
};
