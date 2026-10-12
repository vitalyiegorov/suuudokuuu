import { msg } from '@lingui/core/macro';
import { StepScriptStepKindEnum } from '@suuudokuuu/field-core';
import { ChainLinkEnum, ForcingOutcomeKindEnum, SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { isDefined } from '@rnw-community/shared';

import { NarrationFamilyEnum } from '../enums/narration-family.enum';

import type { MessageDescriptor } from '@lingui/core';
import type { StepScriptBranchStepInterface, StepScriptChainStepInterface, StepScriptStepType } from '@suuudokuuu/field-core';
import type { CellInterface } from '@suuudokuuu/generator';
import type { ChainCandidateInterface, ForcingContradictionType } from '@suuudokuuu/techniques';

const narrationFamilies: Partial<Record<SolutionTechniqueEnum, NarrationFamilyEnum>> = {
    [SolutionTechniqueEnum.PointingPair]: NarrationFamilyEnum.POINTING,
    [SolutionTechniqueEnum.PointingTriple]: NarrationFamilyEnum.POINTING,
    [SolutionTechniqueEnum.BoxLineReduction]: NarrationFamilyEnum.BOX_LINE,
    [SolutionTechniqueEnum.HiddenPair]: NarrationFamilyEnum.HIDDEN_SUBSET,
    [SolutionTechniqueEnum.HiddenTriple]: NarrationFamilyEnum.HIDDEN_SUBSET,
    [SolutionTechniqueEnum.HiddenQuad]: NarrationFamilyEnum.HIDDEN_SUBSET,
    [SolutionTechniqueEnum.XWing]: NarrationFamilyEnum.FISH,
    [SolutionTechniqueEnum.Swordfish]: NarrationFamilyEnum.FISH,
    [SolutionTechniqueEnum.Jellyfish]: NarrationFamilyEnum.FISH,
    [SolutionTechniqueEnum.FinnedXWing]: NarrationFamilyEnum.FISH,
    [SolutionTechniqueEnum.FinnedSwordfish]: NarrationFamilyEnum.FISH,
    [SolutionTechniqueEnum.SashimiXWing]: NarrationFamilyEnum.FISH,
    [SolutionTechniqueEnum.SashimiSwordfish]: NarrationFamilyEnum.FISH,
    [SolutionTechniqueEnum.XYWing]: NarrationFamilyEnum.WING,
    [SolutionTechniqueEnum.XYZWing]: NarrationFamilyEnum.WING,
    [SolutionTechniqueEnum.WWing]: NarrationFamilyEnum.CHAIN,
    [SolutionTechniqueEnum.XChain]: NarrationFamilyEnum.CHAIN,
    [SolutionTechniqueEnum.XYChain]: NarrationFamilyEnum.CHAIN,
    [SolutionTechniqueEnum.SimpleColoring]: NarrationFamilyEnum.COLORING,
    [SolutionTechniqueEnum.AIC]: NarrationFamilyEnum.CHAIN,
    [SolutionTechniqueEnum.UniqueRectangle]: NarrationFamilyEnum.UNIQUE_RECTANGLE,
    [SolutionTechniqueEnum.BivalueUniversalGrave]: NarrationFamilyEnum.BUG,
    [SolutionTechniqueEnum.NishioForcingChain]: NarrationFamilyEnum.FORCING_CHAIN,
    [SolutionTechniqueEnum.CellForcingChain]: NarrationFamilyEnum.FORCING_CHAIN,
    [SolutionTechniqueEnum.RegionForcingChain]: NarrationFamilyEnum.FORCING_CHAIN
};

const getNarrationFamily = (technique: SolutionTechniqueEnum): NarrationFamilyEnum =>
    narrationFamilies[technique] ?? NarrationFamilyEnum.LOCKED_SET;

const joinValues = (values: number[]): string => values.join(', ');

const formatCell = (cell: CellInterface): string => `r${cell.y + 1}c${cell.x + 1}`;

const formatCandidate = ({ cell, value }: Pick<ChainCandidateInterface, 'cell' | 'value'>): string => `${formatCell(cell)}=${value}`;

const formatChainCandidate = ({ cell, link, value }: ChainCandidateInterface): string => {
    const linkSymbol = link === ChainLinkEnum.WEAK ? ' − ' : ' = ';

    return `${isDefined(link) ? linkSymbol : ''}(${value})${formatCell(cell)}`;
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
    const assumptionCell = formatCell(assumption.cell);
    const assumptionValue = assumption.value;

    if (outcome.kind === ForcingOutcomeKindEnum.NO_POSITION) {
        const { value } = outcome;

        return msg`If ${path} → ${value} has no place left in the outlined cells. So ${assumptionCell} is not ${assumptionValue}.`;
    }

    const cell = formatCell(outcome.cell);

    if (outcome.kind === ForcingOutcomeKindEnum.EMPTY_CELL) {
        return msg`If ${path} → ${cell} runs out of candidates. So ${assumptionCell} is not ${assumptionValue}.`;
    }

    const { value } = outcome;

    return msg`If ${path} → ${cell} would have to be ${value}, which is no longer possible. So ${assumptionCell} is not ${assumptionValue}.`;
};

const getBranchNarration = ({ branch, branchIndex, branchCount }: StepScriptBranchStepInterface): MessageDescriptor => {
    const { assumption, implications, outcome } = branch;
    const path = [assumption, ...implications].map(formatCandidate).join(' → ');
    const branchNumber = branchIndex + 1;

    if (outcome.kind === ForcingOutcomeKindEnum.COMMON_PLACEMENT) {
        const placement = formatCandidate(outcome);

        return msg`Branch ${branchNumber} of ${branchCount}: if ${path}. This branch leads to ${placement}.`;
    }

    if (outcome.kind === ForcingOutcomeKindEnum.COMMON_ELIMINATIONS) {
        const eliminations = outcome.eliminations.map(({ cell, value }) => `${formatCell(cell)}≠${value}`).join(', ');

        return msg`Branch ${branchNumber} of ${branchCount}: if ${path}. This branch rules out ${eliminations}.`;
    }

    return getRefutationNarration(outcome, path, assumption);
};

const isSameRow = (cells: CellInterface[]): boolean => cells.every(cell => cell.y === cells[0].y);

const isSameColumn = (cells: CellInterface[]): boolean => cells.every(cell => cell.x === cells[0].x);

const isSameBox = (cells: CellInterface[]): boolean => cells.every(cell => cell.group === cells[0].group);

const getUnitKind = (cells: CellInterface[]): 'row' | 'column' | 'box' | null => {
    if (cells.length !== 9) {
        return null;
    }

    if (isSameRow(cells)) {
        return 'row';
    }

    if (isSameColumn(cells)) {
        return 'column';
    }

    if (isSameBox(cells)) {
        return 'box';
    }

    return null;
};

const getHiddenSingleNarration = (techniqueName: string, unit: 'row' | 'column' | 'box' | null, value: string): MessageDescriptor => {
    if (unit === 'row') {
        return msg`${techniqueName}: in the highlighted row, ${value} fits only in the marked cell.`;
    }

    if (unit === 'column') {
        return msg`${techniqueName}: in the highlighted column, ${value} fits only in the marked cell.`;
    }

    if (unit === 'box') {
        return msg`${techniqueName}: in the highlighted box, ${value} fits only in the marked cell.`;
    }

    return msg`${techniqueName}: the highlighted cells leave only ${value} for the marked cell.`;
};

const getFullHouseNarration = (techniqueName: string, unit: 'row' | 'column' | 'box' | null, value: string): MessageDescriptor => {
    if (unit === 'row') {
        return msg`${techniqueName}: the highlighted row has one empty cell left, so ${value} goes there.`;
    }

    if (unit === 'column') {
        return msg`${techniqueName}: the highlighted column has one empty cell left, so ${value} goes there.`;
    }

    if (unit === 'box') {
        return msg`${techniqueName}: the highlighted box has one empty cell left, so ${value} goes there.`;
    }

    return msg`${techniqueName}: the highlighted cells leave only ${value} for the marked cell.`;
};

const getPlacementRevealNarration = (step: StepScriptStepType, techniqueName: string, value: string): MessageDescriptor => {
    const unit = getUnitKind(step.narration.cells);

    if (step.narration.technique === SolutionTechniqueEnum.NakedSingle) {
        return msg`${techniqueName}: the marked cell sees every highlighted digit except ${value}.`;
    }

    if (step.narration.technique === SolutionTechniqueEnum.HiddenSingle) {
        return getHiddenSingleNarration(techniqueName, unit, value);
    }

    if (step.narration.technique === SolutionTechniqueEnum.FullHouse) {
        return getFullHouseNarration(techniqueName, unit, value);
    }

    const family = getNarrationFamily(step.narration.technique);

    if (family === NarrationFamilyEnum.BUG) {
        return msg`${techniqueName}: every other empty cell has two candidates, so ${value} must go in the marked cell to avoid a deadly pattern.`;
    }

    if (family === NarrationFamilyEnum.FORCING_CHAIN) {
        return msg`${techniqueName}: every possibility in the highlighted cells leads to ${value} in the marked cell.`;
    }

    return msg`${techniqueName}: the highlighted cells leave only ${value} for the marked cell.`;
};

type EliminationRevealNarrationType = (techniqueName: string, valueList: string, revealed: ChainCandidateInterface[]) => MessageDescriptor;

type EliminationStrikeNarrationType = (techniqueName: string, valueList: string, cellList: string) => MessageDescriptor;

const getPointingNarration: EliminationRevealNarrationType = (techniqueName, valueList, [{ cell: firstCell }, { cell: secondCell }]) => {
    const rowNumber = firstCell.y + 1;
    const columnNumber = firstCell.x + 1;

    return firstCell.y === secondCell.y
        ? msg`${techniqueName}: in this box, ${valueList} fits only in the highlighted cells, and they all lie in row ${rowNumber}.`
        : msg`${techniqueName}: in this box, ${valueList} fits only in the highlighted cells, and they all lie in column ${columnNumber}.`;
};

const getBoxLineNarration: EliminationRevealNarrationType = (techniqueName, valueList, [{ cell: firstCell }, { cell: secondCell }]) => {
    const rowNumber = firstCell.y + 1;
    const columnNumber = firstCell.x + 1;

    return firstCell.y === secondCell.y
        ? msg`${techniqueName}: in row ${rowNumber}, ${valueList} fits only in the highlighted cells, and they all lie in one box.`
        : msg`${techniqueName}: in column ${columnNumber}, ${valueList} fits only in the highlighted cells, and they all lie in one box.`;
};

const getSeesAllStrikeNarration: EliminationStrikeNarrationType = (techniqueName, valueList, cellList) =>
    msg`${techniqueName}: each marked cell sees all the highlighted cells, so ${cellList} cannot be ${valueList}.`;

const getDeadlyPatternStrikeNarration: EliminationStrikeNarrationType = (techniqueName, valueList) =>
    msg`${techniqueName}: to avoid the deadly pattern, ${valueList} is ruled out of the marked cells.`;

const eliminationRevealNarrations: Record<NarrationFamilyEnum, EliminationRevealNarrationType> = {
    [NarrationFamilyEnum.POINTING]: getPointingNarration,
    [NarrationFamilyEnum.BOX_LINE]: getBoxLineNarration,
    [NarrationFamilyEnum.HIDDEN_SUBSET]: (techniqueName, valueList) =>
        msg`${techniqueName}: within one row, column or box, ${valueList} fit only in the highlighted cells, so those cells can hold nothing else.`,
    [NarrationFamilyEnum.LOCKED_SET]: (techniqueName, valueList) =>
        msg`${techniqueName}: the highlighted cells hold exactly as many digits as there are cells, so ${valueList} can only go in these cells.`,
    [NarrationFamilyEnum.FISH]: (techniqueName, valueList) =>
        msg`${techniqueName}: in the highlighted base lines, ${valueList} fits only in the highlighted cells, so it is locked into the cover lines.`,
    [NarrationFamilyEnum.WING]: (techniqueName, valueList) =>
        msg`${techniqueName}: whichever way the highlighted pivot cell is solved, one of its pincer cells becomes ${valueList}.`,
    [NarrationFamilyEnum.CHAIN]: (techniqueName, _valueList, revealed) => {
        const firstEnd = formatChainCandidate(revealed[0]);
        const lastEnd = formatChainCandidate(revealed[revealed.length - 1]);

        return msg`${techniqueName}: the highlighted cells form a chain, so ${firstEnd} or ${lastEnd} is true.`;
    },
    [NarrationFamilyEnum.COLORING]: (techniqueName, valueList) =>
        msg`${techniqueName}: the highlighted cells split into two colors for ${valueList}, and exactly one color holds every ${valueList}.`,
    [NarrationFamilyEnum.UNIQUE_RECTANGLE]: (techniqueName, valueList) =>
        msg`${techniqueName}: the highlighted cells would form a deadly pattern of ${valueList} that leaves the puzzle with two solutions.`,
    [NarrationFamilyEnum.BUG]: (techniqueName, valueList) =>
        msg`${techniqueName}: the highlighted cells would leave a deadly pattern of ${valueList}.`,
    [NarrationFamilyEnum.FORCING_CHAIN]: techniqueName =>
        msg`${techniqueName}: from the highlighted cells, every possibility is followed until it hits a contradiction or the same result.`
};

const eliminationStrikeNarrations: Record<NarrationFamilyEnum, EliminationStrikeNarrationType> = {
    [NarrationFamilyEnum.POINTING]: getSeesAllStrikeNarration,
    [NarrationFamilyEnum.BOX_LINE]: getSeesAllStrikeNarration,
    [NarrationFamilyEnum.LOCKED_SET]: getSeesAllStrikeNarration,
    [NarrationFamilyEnum.HIDDEN_SUBSET]: (techniqueName, valueList, cellList) =>
        msg`${techniqueName}: those cells are reserved for that set of digits, so ${cellList} cannot be ${valueList}.`,
    [NarrationFamilyEnum.FISH]: (techniqueName, valueList) =>
        msg`${techniqueName}: ${valueList} must sit in the base lines, so the cover lines lose it in the marked cells.`,
    [NarrationFamilyEnum.WING]: (techniqueName, valueList) =>
        msg`${techniqueName}: a pincer cell is always ${valueList}, so the marked cells that see both pincers cannot be ${valueList}.`,
    [NarrationFamilyEnum.CHAIN]: (techniqueName, valueList, cellList) =>
        msg`${techniqueName}: one end of the chain is always true and each marked candidate clashes with both ends, so ${cellList} cannot be ${valueList}.`,
    [NarrationFamilyEnum.COLORING]: (techniqueName, valueList) =>
        msg`${techniqueName}: the marked cells either see both colors or carry a color that contradicts itself, so they cannot be ${valueList}.`,
    [NarrationFamilyEnum.UNIQUE_RECTANGLE]: getDeadlyPatternStrikeNarration,
    [NarrationFamilyEnum.BUG]: getDeadlyPatternStrikeNarration,
    [NarrationFamilyEnum.FORCING_CHAIN]: (techniqueName, valueList) =>
        msg`${techniqueName}: every possibility ends in a contradiction or the same result, so ${valueList} is ruled out of the marked cells.`
};

export const gameGetStepNarration = (step: StepScriptStepType, techniqueName: string): MessageDescriptor => {
    const valueList = joinValues(step.narration.values);

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
        const cellList = [...new Set(step.narration.cells.map(formatCell))].join(', ');

        return eliminationStrikeNarrations[getNarrationFamily(step.narration.technique)](techniqueName, valueList, cellList);
    }

    return msg`Place ${valueList} in the marked cell.`;
};
