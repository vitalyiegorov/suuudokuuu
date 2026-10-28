import { msg, plural } from '@lingui/core/macro';
import { HintLevelEnum, HintRegionKindEnum, StepScriptStepKindEnum, getHintRegion } from '@suuudokuuu/field-core';

import { isDefined } from '@rnw-community/shared';

import { techniqueNarrationFamilyConstant } from '../constant/technique-narration-family.constant';
import { ListConjunctionEnum } from '../enums/list-conjunction.enum';
import { NarrationFamilyEnum } from '../enums/narration-family.enum';

import { gameFormatList } from './game-format-list.util';
import { gameGetCellName } from './game-get-cell-name.util';
import { gameGetEliminationList } from './game-get-elimination-list.util';

import type { I18n, MessageDescriptor } from '@lingui/core';
import type { StepScriptStepType } from '@suuudokuuu/field-core';

type RegionNudgeType = (regionNumber: number, subsetSize: number) => MessageDescriptor;

type RegionPatternType = (regionNumber: number, cellList: string, digitList: string, digitChoice: string) => MessageDescriptor;

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

const nakedPatterns: Partial<Record<HintRegionKindEnum, RegionPatternType>> = {
    [HintRegionKindEnum.ROW]: (regionNumber, cellList, digitList, digitChoice) =>
        msg`${cellList} can only be ${digitChoice}: every other digit already appears in each cell's row, column or box. So ${digitList} must go in these cells and nowhere else in row ${regionNumber}.`,
    [HintRegionKindEnum.COLUMN]: (regionNumber, cellList, digitList, digitChoice) =>
        msg`${cellList} can only be ${digitChoice}: every other digit already appears in each cell's row, column or box. So ${digitList} must go in these cells and nowhere else in column ${regionNumber}.`,
    [HintRegionKindEnum.BOX]: (regionNumber, cellList, digitList, digitChoice) =>
        msg`${cellList} can only be ${digitChoice}: every other digit already appears in each cell's row, column or box. So ${digitList} must go in these cells and nowhere else in box ${regionNumber}.`
};

const hiddenPatterns: Partial<Record<HintRegionKindEnum, RegionPatternType>> = {
    [HintRegionKindEnum.ROW]: (regionNumber, cellList, digitList) =>
        msg`In row ${regionNumber}, ${digitList} fit only in ${cellList}, so those cells hold nothing else.`,
    [HintRegionKindEnum.COLUMN]: (regionNumber, cellList, digitList) =>
        msg`In column ${regionNumber}, ${digitList} fit only in ${cellList}, so those cells hold nothing else.`,
    [HintRegionKindEnum.BOX]: (regionNumber, cellList, digitList) =>
        msg`In box ${regionNumber}, ${digitList} fit only in ${cellList}, so those cells hold nothing else.`
};

const nakedStrikes: Partial<
    Record<HintRegionKindEnum, (regionNumber: number, digitList: string, eliminationList: string) => MessageDescriptor>
> = {
    [HintRegionKindEnum.ROW]: (regionNumber, digitList, eliminationList) =>
        msg`${digitList} cannot go anywhere else in row ${regionNumber}, so ${eliminationList}.`,
    [HintRegionKindEnum.COLUMN]: (regionNumber, digitList, eliminationList) =>
        msg`${digitList} cannot go anywhere else in column ${regionNumber}, so ${eliminationList}.`,
    [HintRegionKindEnum.BOX]: (regionNumber, digitList, eliminationList) =>
        msg`${digitList} cannot go anywhere else in box ${regionNumber}, so ${eliminationList}.`
};

const getFallbackNudge: RegionNudgeType = () => msg`Look at the highlighted cells.`;

const getFallbackPattern: RegionPatternType = (_regionNumber, cellList, digitList) =>
    msg`${digitList} must go in ${cellList}, so those cells hold nothing else.`;

const isRevealStep = (step: StepScriptStepType): boolean => step.kind === StepScriptStepKindEnum.RevealCandidates;

export const gameGetSubsetNarration = (
    steps: readonly StepScriptStepType[],
    stepIndex: number,
    hintLevel: HintLevelEnum,
    i18n: I18n
): MessageDescriptor | null => {
    const isLevelPage = hintLevel !== HintLevelEnum.WALKTHROUGH;
    const revealIndex = isLevelPage ? steps.findIndex(isRevealStep) : steps.slice(0, stepIndex + 1).findLastIndex(isRevealStep);
    const revealStep = revealIndex < 0 ? null : steps.at(revealIndex);
    const step = isLevelPage ? revealStep : steps.at(stepIndex);
    const family = isDefined(revealStep) ? techniqueNarrationFamilyConstant[revealStep.narration.technique] : null;
    const isHidden = family === NarrationFamilyEnum.HIDDEN_SUBSET;

    if (!isDefined(revealStep) || !isDefined(step) || (!isHidden && family !== NarrationFamilyEnum.NAKED_SUBSET)) {
        return null;
    }

    const { cells, values } = revealStep.narration;
    const eliminations = steps
        .slice(revealIndex)
        .find(scriptStep => scriptStep.kind === StepScriptStepKindEnum.StrikeCandidates)?.narration;
    const region = getHintRegion([...cells, ...(eliminations?.cells.slice(0, 1) ?? [])]);
    const regionKind = region?.kind ?? HintRegionKindEnum.CELL;
    const regionNumber = region?.number ?? 0;
    const cellList = gameFormatList(cells.map(gameGetCellName), ListConjunctionEnum.AND, i18n);
    const digitList = gameFormatList(values, ListConjunctionEnum.AND, i18n);

    if (hintLevel === HintLevelEnum.TECHNIQUE) {
        return ((isHidden ? hiddenNudges : nakedNudges)[regionKind] ?? getFallbackNudge)(regionNumber, cells.length);
    }

    if (step.kind === StepScriptStepKindEnum.RevealCandidates) {
        const digitChoice = gameFormatList(values, ListConjunctionEnum.OR, i18n);

        return ((isHidden ? hiddenPatterns : nakedPatterns)[regionKind] ?? getFallbackPattern)(
            regionNumber,
            cellList,
            digitList,
            digitChoice
        );
    }

    if (step.kind !== StepScriptStepKindEnum.StrikeCandidates) {
        return null;
    }

    const eliminationList = gameGetEliminationList(step.eliminations, i18n);
    const nakedStrike = nakedStrikes[regionKind];

    if (isHidden) {
        return msg`${cellList} are kept for ${digitList}, so ${eliminationList}.`;
    }

    return isDefined(nakedStrike)
        ? nakedStrike(regionNumber, digitList, eliminationList)
        : msg`${digitList} must stay in ${cellList}, so ${eliminationList}.`;
};
