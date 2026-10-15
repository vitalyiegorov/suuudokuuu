import { msg } from '@lingui/core/macro';
import { HintRegionKindEnum, StepScriptStepKindEnum, getBoxNumber, getHintRegion } from '@suuudokuuu/field-core';
import { defaultSudokuConfig } from '@suuudokuuu/generator';
import { ChainLinkEnum, ForcingOutcomeKindEnum, SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { isDefined } from '@rnw-community/shared';

import { techniqueNarrationFamilyConstant } from '../constant/technique-narration-family.constant';
import { NarrationFamilyEnum } from '../enums/narration-family.enum';

import { gameGetCellName } from './game-get-cell-name.util';

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
    assumption: Pick<ChainCandidateInterface, 'cell' | 'value'>
): MessageDescriptor => {
    const assumptionCell = gameGetCellName(assumption.cell);
    const assumptionValue = assumption.value;

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

type UnitPlacementNarrationType = (techniqueName: string, value: string, regionNumber: number) => MessageDescriptor;

const getRemainingValueNarration = (techniqueName: string, value: string): MessageDescriptor =>
    msg`${techniqueName}: the highlighted cells leave only ${value} for the marked cell.`;

const hiddenSingleNarrations: Partial<Record<HintRegionKindEnum, UnitPlacementNarrationType>> = {
    [HintRegionKindEnum.ROW]: (techniqueName, value, regionNumber) =>
        msg`${techniqueName}: in row ${regionNumber}, ${value} fits only in the marked cell.`,
    [HintRegionKindEnum.COLUMN]: (techniqueName, value, regionNumber) =>
        msg`${techniqueName}: in column ${regionNumber}, ${value} fits only in the marked cell.`,
    [HintRegionKindEnum.BOX]: (techniqueName, value, regionNumber) =>
        msg`${techniqueName}: in box ${regionNumber}, ${value} fits only in the marked cell.`
};

const fullHouseNarrations: Partial<Record<HintRegionKindEnum, UnitPlacementNarrationType>> = {
    [HintRegionKindEnum.ROW]: (techniqueName, value, regionNumber) =>
        msg`${techniqueName}: row ${regionNumber} has one empty cell left, so ${value} goes there.`,
    [HintRegionKindEnum.COLUMN]: (techniqueName, value, regionNumber) =>
        msg`${techniqueName}: column ${regionNumber} has one empty cell left, so ${value} goes there.`,
    [HintRegionKindEnum.BOX]: (techniqueName, value, regionNumber) =>
        msg`${techniqueName}: box ${regionNumber} has one empty cell left, so ${value} goes there.`
};

const getPlacementRevealNarration = (step: StepScriptStepType, techniqueName: string, value: string): MessageDescriptor => {
    const { cells, technique } = step.narration;
    const unit = cells.length === defaultSudokuConfig.fieldSize ? getHintRegion(cells) : null;
    const family = getNarrationFamily(technique);

    if (technique === SolutionTechniqueEnum.NakedSingle) {
        return msg`${techniqueName}: the marked cell sees every highlighted digit except ${value}.`;
    }

    if (technique === SolutionTechniqueEnum.HiddenSingle || technique === SolutionTechniqueEnum.FullHouse) {
        const unitNarrations = technique === SolutionTechniqueEnum.HiddenSingle ? hiddenSingleNarrations : fullHouseNarrations;

        const unitNarration = unitNarrations[unit?.kind ?? HintRegionKindEnum.CELL] ?? getRemainingValueNarration;

        return unitNarration(techniqueName, value, unit?.number ?? 0);
    }

    if (family === NarrationFamilyEnum.BUG) {
        return msg`${techniqueName}: every other empty cell has two candidates, so ${value} must go in the marked cell to avoid a deadly pattern.`;
    }

    if (family === NarrationFamilyEnum.FORCING_CHAIN) {
        return msg`${techniqueName}: every possibility in the highlighted cells leads to ${value} in the marked cell.`;
    }

    return getRemainingValueNarration(techniqueName, value);
};

type EliminationRevealNarrationType = (techniqueName: string, valueList: string, revealed: ChainCandidateInterface[]) => MessageDescriptor;

type EliminationStrikeNarrationType = (techniqueName: string, valueList: string, eliminationList: string) => MessageDescriptor;

const getLockedCandidatesNarration =
    (isPointing: boolean): EliminationRevealNarrationType =>
    (techniqueName, valueList, [{ cell: firstCell }, { cell: secondCell }]) => {
        const boxNumber = getBoxNumber(firstCell);
        const rowNumber = firstCell.y + 1;
        const columnNumber = firstCell.x + 1;
        const isRowLine = firstCell.y === secondCell.y;

        if (isPointing) {
            return isRowLine
                ? msg`${techniqueName}: in box ${boxNumber}, ${valueList} fits only in the highlighted cells, and they all lie in row ${rowNumber}.`
                : msg`${techniqueName}: in box ${boxNumber}, ${valueList} fits only in the highlighted cells, and they all lie in column ${columnNumber}.`;
        }

        return isRowLine
            ? msg`${techniqueName}: in row ${rowNumber}, ${valueList} fits only in the highlighted cells, and they all lie in box ${boxNumber}.`
            : msg`${techniqueName}: in column ${columnNumber}, ${valueList} fits only in the highlighted cells, and they all lie in box ${boxNumber}.`;
    };

const getSeesAllStrikeNarration: EliminationStrikeNarrationType = (techniqueName, _valueList, eliminationList) =>
    msg`${techniqueName}: each marked cell sees all the highlighted cells, so ${eliminationList}.`;

const getLockedSetRevealNarration: EliminationRevealNarrationType = (techniqueName, valueList) =>
    msg`${techniqueName}: the highlighted cells hold exactly as many digits as there are cells, so ${valueList} can only go in these cells.`;

const getDeadlyPatternStrikeNarration: EliminationStrikeNarrationType = (techniqueName, _valueList, eliminationList) =>
    msg`${techniqueName}: to avoid the deadly pattern, ${eliminationList}.`;

const eliminationRevealNarrations: Record<NarrationFamilyEnum, EliminationRevealNarrationType> = {
    [NarrationFamilyEnum.POINTING]: getLockedCandidatesNarration(true),
    [NarrationFamilyEnum.BOX_LINE]: getLockedCandidatesNarration(false),
    [NarrationFamilyEnum.HIDDEN_SUBSET]: (techniqueName, valueList) =>
        msg`${techniqueName}: within one row, column or box, ${valueList} fit only in the highlighted cells, so those cells can hold nothing else.`,
    [NarrationFamilyEnum.LOCKED_SET]: getLockedSetRevealNarration,
    [NarrationFamilyEnum.FISH]: (techniqueName, valueList) =>
        msg`${techniqueName}: in the highlighted base lines, ${valueList} fits only in the highlighted cells, so it is locked into the cover lines.`,
    [NarrationFamilyEnum.WING]: (techniqueName, valueList) =>
        msg`${techniqueName}: whichever way the highlighted pivot cell is solved, one of its pincer cells becomes ${valueList}.`,
    [NarrationFamilyEnum.CHAIN]: (techniqueName, _valueList, revealed) => {
        const firstEnd = formatChainCandidate(revealed[0]);
        const lastEnd = formatChainCandidate(revealed[revealed.length - 1]);

        return msg`${techniqueName}: a chain links the highlighted ends, so ${firstEnd} or ${lastEnd} is true.`;
    },
    [NarrationFamilyEnum.COLORING]: (techniqueName, valueList) =>
        msg`${techniqueName}: the highlighted cells split into two colors for ${valueList}, and exactly one color holds every ${valueList}.`,
    [NarrationFamilyEnum.UNIQUE_RECTANGLE]: (techniqueName, valueList) =>
        msg`${techniqueName}: the highlighted cells would form a deadly pattern of ${valueList} that leaves the puzzle with two solutions.`,
    [NarrationFamilyEnum.BUG]: (techniqueName, valueList) =>
        msg`${techniqueName}: the highlighted cells would leave a deadly pattern of ${valueList}.`,
    [NarrationFamilyEnum.FORCING_CHAIN]: techniqueName =>
        msg`${techniqueName}: from the highlighted cells, every possibility is followed until it hits a contradiction or the same result.`,
    [NarrationFamilyEnum.EMPTY_RECTANGLE]: (techniqueName, valueList) =>
        msg`${techniqueName}: in the highlighted box, ${valueList} fits only on one row and one column, and the highlighted pair outside the box holds ${valueList} at one end or the other.`,
    [NarrationFamilyEnum.ALMOST_LOCKED_SET]: techniqueName =>
        msg`${techniqueName}: each highlighted group has one more candidate than cells, and the two groups share a digit that only one of them can hold.`,
    [NarrationFamilyEnum.SUE_DE_COQ]: getLockedSetRevealNarration
};

const eliminationStrikeNarrations: Record<NarrationFamilyEnum, EliminationStrikeNarrationType> = {
    [NarrationFamilyEnum.POINTING]: getSeesAllStrikeNarration,
    [NarrationFamilyEnum.BOX_LINE]: getSeesAllStrikeNarration,
    [NarrationFamilyEnum.LOCKED_SET]: getSeesAllStrikeNarration,
    [NarrationFamilyEnum.HIDDEN_SUBSET]: (techniqueName, _valueList, eliminationList) =>
        msg`${techniqueName}: those cells are reserved for that set of digits, so ${eliminationList}.`,
    [NarrationFamilyEnum.FISH]: (techniqueName, valueList, eliminationList) =>
        msg`${techniqueName}: ${valueList} must sit in the base lines, so ${eliminationList}.`,
    [NarrationFamilyEnum.WING]: (techniqueName, valueList, eliminationList) =>
        msg`${techniqueName}: a pincer cell is always ${valueList} and each marked cell sees both pincers, so ${eliminationList}.`,
    [NarrationFamilyEnum.CHAIN]: (techniqueName, _valueList, eliminationList) =>
        msg`${techniqueName}: one end of the chain is always true and each marked candidate clashes with both ends, so ${eliminationList}.`,
    [NarrationFamilyEnum.COLORING]: (techniqueName, _valueList, eliminationList) =>
        msg`${techniqueName}: the marked cells either see both colors or carry a color that contradicts itself, so ${eliminationList}.`,
    [NarrationFamilyEnum.UNIQUE_RECTANGLE]: getDeadlyPatternStrikeNarration,
    [NarrationFamilyEnum.BUG]: getDeadlyPatternStrikeNarration,
    [NarrationFamilyEnum.FORCING_CHAIN]: (techniqueName, _valueList, eliminationList) =>
        msg`${techniqueName}: every possibility ends in a contradiction or the same result, so ${eliminationList}.`,
    [NarrationFamilyEnum.EMPTY_RECTANGLE]: (techniqueName, valueList, eliminationList) =>
        msg`${techniqueName}: either way, ${valueList} lands in a cell the marked cells see, so ${eliminationList}.`,
    [NarrationFamilyEnum.ALMOST_LOCKED_SET]: (techniqueName, valueList, eliminationList) =>
        msg`${techniqueName}: one of the groups must hold ${valueList}, and each marked cell sees every ${valueList} in both groups, so ${eliminationList}.`,
    [NarrationFamilyEnum.SUE_DE_COQ]: (techniqueName, _valueList, eliminationList) =>
        msg`${techniqueName}: the highlighted cells share their digits between the line and the box without repeating one, so ${eliminationList}.`
};

const getEliminationList = (eliminations: readonly StepScriptCandidateInterface[], i18n: I18n): string =>
    [...new Set(eliminations.map(({ cell }) => gameGetCellName(cell)))]
        .map(cell => {
            const values = eliminations
                .flatMap(elimination => (gameGetCellName(elimination.cell) === cell ? [elimination.value] : []))
                .join(', ');

            return i18n._(msg`${cell} cannot be ${values}`);
        })
        .join('; ');

export const gameGetStepNarration = (
    step: StepScriptStepType,
    techniqueName: string,
    i18n: I18n,
    scriptSteps: readonly StepScriptStepType[] = []
): MessageDescriptor => {
    const valueList = step.narration.values.join(', ');

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
            return getPlacementRevealNarration(step, techniqueName, valueList);
        }

        return eliminationRevealNarrations[getNarrationFamily(step.narration.technique)](techniqueName, valueList, step.candidates);
    }

    if (step.kind === StepScriptStepKindEnum.StrikeCandidates) {
        const refutedBranch = findRefutedBranch(step.eliminations, scriptSteps);
        const strikeNarration = eliminationStrikeNarrations[getNarrationFamily(step.narration.technique)];

        if (isDefined(refutedBranch) && isCellContradiction(refutedBranch.outcome)) {
            return getRefutationNarration(refutedBranch.outcome, formatCandidate(refutedBranch.assumption), refutedBranch.assumption);
        }

        return strikeNarration(techniqueName, valueList, getEliminationList(step.eliminations, i18n));
    }

    return msg`Place ${valueList} in the marked cell.`;
};
