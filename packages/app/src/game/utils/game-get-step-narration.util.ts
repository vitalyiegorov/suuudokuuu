import { msg } from '@lingui/core/macro';
import { HintLevelEnum, HintRegionKindEnum, StepScriptStepKindEnum, getBoxNumber, getHintRegion } from '@suuudokuuu/field-core';
import { defaultSudokuConfig } from '@suuudokuuu/generator';
import { ChainLinkEnum, ForcingOutcomeKindEnum, SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { isDefined, isNotEmptyArray } from '@rnw-community/shared';

import { techniqueNarrationFamilyConstant } from '../constant/technique-narration-family.constant';
import { ListConjunctionEnum } from '../enums/list-conjunction.enum';
import { NarrationFamilyEnum } from '../enums/narration-family.enum';

import { gameFormatList } from './game-format-list.util';
import { gameGetCellName } from './game-get-cell-name.util';
import { gameGetEliminationList } from './game-get-elimination-list.util';
import { gameGetSubsetNarration } from './game-get-subset-narration.util';

import type { I18n, MessageDescriptor } from '@lingui/core';
import type {
    StepScriptBranchStepInterface,
    StepScriptChainStepInterface,
    StepScriptCandidateInterface,
    StepScriptStepType
} from '@suuudokuuu/field-core';
import type { ChainCandidateInterface, ForcingContradictionType, ForcingOutcomeType } from '@suuudokuuu/techniques';

const getNarrationFamily = (technique: SolutionTechniqueEnum): NarrationFamilyEnum =>
    techniqueNarrationFamilyConstant[technique] ?? NarrationFamilyEnum.LOCKED_SET;

const formatCandidate = ({ cell, value }: Pick<ChainCandidateInterface, 'cell' | 'value'>): string => `${gameGetCellName(cell)}=${value}`;

const formatChainCandidate = ({ cell, link, value }: ChainCandidateInterface): string => {
    const linkSymbol = link === ChainLinkEnum.WEAK ? ' − ' : ' = ';

    return `${isDefined(link) ? linkSymbol : ''}(${value})${gameGetCellName(cell)}`;
};

const getChainNarration = (step: StepScriptChainStepInterface): MessageDescriptor => {
    const path = step.chain.map(formatChainCandidate).join('');

    return msg`Follow the chain ${path}. "=" is a strong link (at least one end is true) and "−" is a weak link (both ends cannot be true), so one end of the chain is always true.`;
};

const getRefutationNarration = (
    outcome: ForcingContradictionType,
    path: string,
    { cell: assumedCell, value: assumptionValue }: Pick<ChainCandidateInterface, 'cell' | 'value'>
): MessageDescriptor => {
    const assumptionCell = gameGetCellName(assumedCell);

    if (outcome.kind === ForcingOutcomeKindEnum.NO_POSITION) {
        const { value } = outcome;

        return msg`If ${path} → ${value} has no place left in the outlined cells. So ${assumptionCell} is not ${assumptionValue}.`;
    }

    const cell = gameGetCellName(outcome.cell);

    if (outcome.kind === ForcingOutcomeKindEnum.EMPTY_CELL) {
        return msg`If ${path} → ${cell} runs out of candidates. So ${assumptionCell} is not ${assumptionValue}.`;
    }

    const { value } = outcome;

    return msg`If ${path} → ${cell} would have to be ${value}, which is no longer possible. So ${assumptionCell} is not ${assumptionValue}.`;
};

const isCellContradiction = (outcome: ForcingOutcomeType): outcome is ForcingContradictionType =>
    outcome.kind === ForcingOutcomeKindEnum.EMPTY_CELL || outcome.kind === ForcingOutcomeKindEnum.ASSIGNMENT_CONFLICT;

const findRefutedBranch = (eliminations: readonly StepScriptCandidateInterface[], scriptSteps: readonly StepScriptStepType[]) =>
    scriptSteps
        .flatMap(scriptStep => (scriptStep.kind === StepScriptStepKindEnum.SHOW_BRANCH ? [scriptStep.branch] : []))
        .find(({ assumption }) =>
            eliminations.some(({ cell, value }) => value === assumption.value && gameGetCellName(cell) === gameGetCellName(assumption.cell))
        );

const getBranchNarration = ({ branch, branchIndex, branchCount }: StepScriptBranchStepInterface): MessageDescriptor => {
    const { assumption, implications, outcome } = branch;
    const path = [assumption, ...implications].map(formatCandidate).join(' → ');
    const branchNumber = branchIndex + 1;

    if (outcome.kind === ForcingOutcomeKindEnum.COMMON_PLACEMENT) {
        const placement = formatCandidate(outcome);

        return msg`Branch ${branchNumber} of ${branchCount}: if ${path}. This branch leads to ${placement}.`;
    }

    if (outcome.kind === ForcingOutcomeKindEnum.COMMON_ELIMINATIONS) {
        const eliminations = outcome.eliminations.map(({ cell, value }) => `${gameGetCellName(cell)}≠${value}`).join(', ');

        return msg`Branch ${branchNumber} of ${branchCount}: if ${path}. This branch rules out ${eliminations}.`;
    }

    return getRefutationNarration(outcome, path, assumption);
};

type UnitPlacementNarrationType = (value: string, regionNumber: number) => MessageDescriptor;

const getRemainingValueNarration = (value: string): MessageDescriptor =>
    msg`The highlighted cells leave only ${value} for the marked cell.`;

const hiddenSingleNarrations: Partial<Record<HintRegionKindEnum, UnitPlacementNarrationType>> = {
    [HintRegionKindEnum.ROW]: (value, regionNumber) => msg`In row ${regionNumber}, ${value} fits only in the marked cell.`,
    [HintRegionKindEnum.COLUMN]: (value, regionNumber) => msg`In column ${regionNumber}, ${value} fits only in the marked cell.`,
    [HintRegionKindEnum.BOX]: (value, regionNumber) => msg`In box ${regionNumber}, ${value} fits only in the marked cell.`
};

const fullHouseNarrations: Partial<Record<HintRegionKindEnum, UnitPlacementNarrationType>> = {
    [HintRegionKindEnum.ROW]: (value, regionNumber) => msg`Row ${regionNumber} has one empty cell left, so ${value} goes there.`,
    [HintRegionKindEnum.COLUMN]: (value, regionNumber) => msg`Column ${regionNumber} has one empty cell left, so ${value} goes there.`,
    [HintRegionKindEnum.BOX]: (value, regionNumber) => msg`Box ${regionNumber} has one empty cell left, so ${value} goes there.`
};

const getPlacementRevealNarration = (step: StepScriptStepType, value: string): MessageDescriptor => {
    const { cells, technique } = step.narration;
    const unit = cells.length === defaultSudokuConfig.fieldSize ? getHintRegion(cells) : null;
    const family = getNarrationFamily(technique);

    if (technique === SolutionTechniqueEnum.NakedSingle) {
        return msg`The marked cell sees every highlighted digit except ${value}.`;
    }

    if (technique === SolutionTechniqueEnum.HiddenSingle || technique === SolutionTechniqueEnum.FullHouse) {
        const unitNarrations = technique === SolutionTechniqueEnum.HiddenSingle ? hiddenSingleNarrations : fullHouseNarrations;
        const unitNarration = unitNarrations[unit?.kind ?? HintRegionKindEnum.CELL] ?? getRemainingValueNarration;

        return unitNarration(value, unit?.number ?? 0);
    }

    if (family === NarrationFamilyEnum.BUG) {
        return msg`Every other empty cell has two candidates, so ${value} must go in the marked cell to avoid a deadly pattern.`;
    }

    if (family === NarrationFamilyEnum.FORCING_CHAIN) {
        return msg`Every possibility in the highlighted cells leads to ${value} in the marked cell.`;
    }

    return getRemainingValueNarration(value);
};

type EliminationRevealNarrationType = (valueList: string, revealed: ChainCandidateInterface[]) => MessageDescriptor;

type EliminationStrikeNarrationType = (valueList: string, eliminationList: string) => MessageDescriptor;

const getLockedCandidatesNarration =
    (isPointing: boolean): EliminationRevealNarrationType =>
    (valueList, [{ cell: firstCell }, { cell: secondCell }]) => {
        const boxNumber = getBoxNumber(firstCell);
        const rowNumber = firstCell.y + 1;
        const columnNumber = firstCell.x + 1;
        const isRowLine = firstCell.y === secondCell.y;

        if (isPointing) {
            return isRowLine
                ? msg`In box ${boxNumber}, ${valueList} fits only in the highlighted cells, and they all lie in row ${rowNumber}.`
                : msg`In box ${boxNumber}, ${valueList} fits only in the highlighted cells, and they all lie in column ${columnNumber}.`;
        }

        return isRowLine
            ? msg`In row ${rowNumber}, ${valueList} fits only in the highlighted cells, and they all lie in box ${boxNumber}.`
            : msg`In column ${columnNumber}, ${valueList} fits only in the highlighted cells, and they all lie in box ${boxNumber}.`;
    };

const getSeesAllStrikeNarration: EliminationStrikeNarrationType = (_valueList, eliminationList) =>
    msg`Each marked cell sees all the highlighted cells, so ${eliminationList}.`;

const getLockedSetRevealNarration: EliminationRevealNarrationType = valueList =>
    msg`The highlighted cells hold exactly as many digits as there are cells, so ${valueList} can only go in these cells.`;

const getDeadlyPatternStrikeNarration: EliminationStrikeNarrationType = (_valueList, eliminationList) =>
    msg`To avoid the deadly pattern, ${eliminationList}.`;

const eliminationRevealNarrations: Partial<Record<NarrationFamilyEnum, EliminationRevealNarrationType>> = {
    [NarrationFamilyEnum.POINTING]: getLockedCandidatesNarration(true),
    [NarrationFamilyEnum.BOX_LINE]: getLockedCandidatesNarration(false),
    [NarrationFamilyEnum.FISH]: valueList =>
        msg`In the highlighted base lines, ${valueList} fits only in the highlighted cells, so it is locked into the cover lines.`,
    [NarrationFamilyEnum.WING]: valueList =>
        msg`Whichever way the highlighted pivot cell is solved, one of its pincer cells becomes ${valueList}.`,
    [NarrationFamilyEnum.CHAIN]: (_valueList, revealed) => {
        const firstEnd = formatChainCandidate(revealed[0]);
        const lastEnd = formatChainCandidate(revealed[revealed.length - 1]);

        return msg`A chain links the highlighted ends, so ${firstEnd} or ${lastEnd} is true.`;
    },
    [NarrationFamilyEnum.COLORING]: valueList =>
        msg`The highlighted cells split into two colors for ${valueList}, and exactly one color holds every ${valueList}.`,
    [NarrationFamilyEnum.UNIQUE_RECTANGLE]: valueList =>
        msg`The highlighted cells would form a deadly pattern of ${valueList} that leaves the puzzle with two solutions.`,
    [NarrationFamilyEnum.BUG]: valueList => msg`The highlighted cells would leave a deadly pattern of ${valueList}.`,
    [NarrationFamilyEnum.FORCING_CHAIN]: () =>
        msg`From the highlighted cells, every possibility is followed until it hits a contradiction or the same result.`,
    [NarrationFamilyEnum.EMPTY_RECTANGLE]: valueList =>
        msg`In the highlighted box, ${valueList} fits only on one row and one column, and the highlighted pair outside the box holds ${valueList} at one end or the other.`,
    [NarrationFamilyEnum.ALMOST_LOCKED_SET]: () =>
        msg`Each highlighted group has one more candidate than cells, and the two groups share a digit that only one of them can hold.`
};

const eliminationStrikeNarrations: Partial<Record<NarrationFamilyEnum, EliminationStrikeNarrationType>> = {
    [NarrationFamilyEnum.POINTING]: getSeesAllStrikeNarration,
    [NarrationFamilyEnum.BOX_LINE]: getSeesAllStrikeNarration,
    [NarrationFamilyEnum.FISH]: (valueList, eliminationList) => msg`${valueList} must sit in the base lines, so ${eliminationList}.`,
    [NarrationFamilyEnum.WING]: (valueList, eliminationList) =>
        msg`A pincer cell is always ${valueList} and each marked cell sees both pincers, so ${eliminationList}.`,
    [NarrationFamilyEnum.CHAIN]: (_valueList, eliminationList) =>
        msg`One end of the chain is always true and each marked candidate clashes with both ends, so ${eliminationList}.`,
    [NarrationFamilyEnum.COLORING]: (_valueList, eliminationList) =>
        msg`The marked cells either see both colors or carry a color that contradicts itself, so ${eliminationList}.`,
    [NarrationFamilyEnum.UNIQUE_RECTANGLE]: getDeadlyPatternStrikeNarration,
    [NarrationFamilyEnum.BUG]: getDeadlyPatternStrikeNarration,
    [NarrationFamilyEnum.FORCING_CHAIN]: (_valueList, eliminationList) =>
        msg`Every possibility ends in a contradiction or the same result, so ${eliminationList}.`,
    [NarrationFamilyEnum.EMPTY_RECTANGLE]: (valueList, eliminationList) =>
        msg`Either way, ${valueList} lands in a cell the marked cells see, so ${eliminationList}.`,
    [NarrationFamilyEnum.ALMOST_LOCKED_SET]: (valueList, eliminationList) =>
        msg`One of the groups must hold ${valueList}, and each marked cell sees every ${valueList} in both groups, so ${eliminationList}.`,
    [NarrationFamilyEnum.SUE_DE_COQ]: (_valueList, eliminationList) =>
        msg`The highlighted cells share their digits between the line and the box without repeating one, so ${eliminationList}.`
};

const getPlaceNarration = (
    scriptSteps: readonly StepScriptStepType[],
    stepIndex: number,
    valueList: string,
    i18n: I18n
): MessageDescriptor => {
    const revealStep = scriptSteps.at(stepIndex - 1);
    const placement = revealStep?.narration.placement;
    const isChainResult = stepIndex > 1 && scriptSteps.at(stepIndex - 2)?.kind === StepScriptStepKindEnum.StrikeCandidates;

    if (!isChainResult || !isDefined(revealStep) || !isDefined(placement)) {
        return msg`Place ${valueList} in the marked cell.`;
    }

    const cellName = gameGetCellName(placement.cell);
    const removedValues = scriptSteps
        .flatMap(scriptStep => (scriptStep.kind === StepScriptStepKindEnum.StrikeCandidates ? scriptStep.eliminations : []))
        .flatMap(elimination => (gameGetCellName(elimination.cell) === cellName ? [elimination.value] : []))
        .sort((left, right) => left - right);

    if (revealStep.narration.technique !== SolutionTechniqueEnum.NakedSingle || !isNotEmptyArray(removedValues)) {
        return getPlacementRevealNarration(revealStep, valueList);
    }

    const { value } = placement;
    const candidateList = gameFormatList(
        [value, ...removedValues].sort((left, right) => left - right),
        ListConjunctionEnum.OR,
        i18n
    );
    const removedList = gameFormatList(removedValues, ListConjunctionEnum.AND, i18n);

    return msg`${cellName} could be ${candidateList}; with ${removedList} gone, only ${value} is left.`;
};

export const gameGetStepNarration = (
    step: StepScriptStepType,
    i18n: I18n,
    scriptSteps: readonly StepScriptStepType[] = []
): MessageDescriptor => {
    const valueList = step.narration.values.join(', ');
    const stepIndex = scriptSteps.indexOf(step);
    const subsetNarration = gameGetSubsetNarration(scriptSteps, stepIndex, HintLevelEnum.WALKTHROUGH, i18n);
    const family = getNarrationFamily(step.narration.technique);

    if (step.kind === StepScriptStepKindEnum.SHOW_CHAIN) {
        return getChainNarration(step);
    }

    if (step.kind === StepScriptStepKindEnum.SHOW_BRANCH) {
        return getBranchNarration(step);
    }

    if (step.kind === StepScriptStepKindEnum.RevealCandidates) {
        if (step.narration.technique === SolutionTechniqueEnum.Guess) {
            return msg`This reveals the marked cell's digit from the solution.`;
        }

        if (isDefined(step.narration.placement)) {
            return getPlacementRevealNarration(step, valueList);
        }

        const revealNarration = eliminationRevealNarrations[family] ?? getLockedSetRevealNarration;

        return subsetNarration ?? revealNarration(valueList, step.candidates);
    }

    if (step.kind === StepScriptStepKindEnum.StrikeCandidates) {
        const refutedBranch = findRefutedBranch(step.eliminations, scriptSteps);
        const strikeNarration = eliminationStrikeNarrations[family] ?? getSeesAllStrikeNarration;

        if (isDefined(refutedBranch) && isCellContradiction(refutedBranch.outcome)) {
            return getRefutationNarration(refutedBranch.outcome, formatCandidate(refutedBranch.assumption), refutedBranch.assumption);
        }

        return subsetNarration ?? strikeNarration(valueList, gameGetEliminationList(step.eliminations, i18n));
    }

    return getPlaceNarration(scriptSteps, stepIndex, valueList, i18n);
};
