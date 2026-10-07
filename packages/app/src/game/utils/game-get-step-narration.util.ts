import { msg } from '@lingui/core/macro';
import { StepScriptStepKindEnum } from '@suuudokuuu/field-core';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { isDefined } from '@rnw-community/shared';

import type { MessageDescriptor } from '@lingui/core';
import type { StepScriptStepType } from '@suuudokuuu/field-core';
import type { CellInterface } from '@suuudokuuu/generator';

enum NarrationFamilyEnum {
    FISH = 'FISH',
    WING = 'WING',
    CHAIN = 'CHAIN',
    COLORING = 'COLORING',
    UNIQUE_RECTANGLE = 'UNIQUE_RECTANGLE',
    BUG = 'BUG',
    FORCING_CHAIN = 'FORCING_CHAIN',
    LOCKED_SET = 'LOCKED_SET'
}

const narrationFamilies: Partial<Record<SolutionTechniqueEnum, NarrationFamilyEnum>> = {
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

const getEliminationRevealNarration = (techniqueName: string, family: NarrationFamilyEnum, valueList: string): MessageDescriptor => {
    if (family === NarrationFamilyEnum.FISH) {
        return msg`${techniqueName}: in the highlighted base lines, ${valueList} fits only in the highlighted cells, so it is locked into the cover lines.`;
    }

    if (family === NarrationFamilyEnum.WING) {
        return msg`${techniqueName}: whichever way the highlighted pivot cell is solved, one of its pincer cells becomes ${valueList}.`;
    }

    if (family === NarrationFamilyEnum.CHAIN) {
        return msg`${techniqueName}: the highlighted cells form a chain, so either one end or the other end of it is ${valueList}.`;
    }

    if (family === NarrationFamilyEnum.COLORING) {
        return msg`${techniqueName}: the highlighted cells split into two colors for ${valueList}, and exactly one color holds every ${valueList}.`;
    }

    if (family === NarrationFamilyEnum.UNIQUE_RECTANGLE) {
        return msg`${techniqueName}: the highlighted cells would form a deadly pattern of ${valueList} that leaves the puzzle with two solutions.`;
    }

    if (family === NarrationFamilyEnum.BUG) {
        return msg`${techniqueName}: the highlighted cells would leave a deadly pattern of ${valueList}.`;
    }

    if (family === NarrationFamilyEnum.FORCING_CHAIN) {
        return msg`${techniqueName}: from the highlighted cells, every possibility is followed until it hits a contradiction or the same result.`;
    }

    return msg`${techniqueName}: the digits ${valueList} are locked into the highlighted cells, which rules them out of other cells.`;
};

const getEliminationStrikeNarration = (techniqueName: string, family: NarrationFamilyEnum, valueList: string): MessageDescriptor => {
    if (family === NarrationFamilyEnum.FISH) {
        return msg`${techniqueName}: ${valueList} must sit in the base lines, so the cover lines lose it in the marked cells.`;
    }

    if (family === NarrationFamilyEnum.WING) {
        return msg`${techniqueName}: a pincer cell is always ${valueList}, so the marked cells that see both pincers cannot be ${valueList}.`;
    }

    if (family === NarrationFamilyEnum.CHAIN) {
        return msg`${techniqueName}: one end of the chain is always ${valueList}, so the marked cells that see both ends cannot be ${valueList}.`;
    }

    if (family === NarrationFamilyEnum.COLORING) {
        return msg`${techniqueName}: the marked cells either see both colors or carry a color that contradicts itself, so they cannot be ${valueList}.`;
    }

    if (family === NarrationFamilyEnum.UNIQUE_RECTANGLE || family === NarrationFamilyEnum.BUG) {
        return msg`${techniqueName}: to avoid the deadly pattern, ${valueList} is ruled out of the marked cells.`;
    }

    if (family === NarrationFamilyEnum.FORCING_CHAIN) {
        return msg`${techniqueName}: every possibility ends in a contradiction or the same result, so ${valueList} is ruled out of the marked cells.`;
    }

    return msg`${techniqueName}: the pattern rules ${valueList} out of the marked cells.`;
};

export const gameGetStepNarration = (step: StepScriptStepType, techniqueName: string): MessageDescriptor => {
    const valueList = joinValues(step.narration.values);

    if (step.kind === StepScriptStepKindEnum.RevealCandidates) {
        if (step.narration.technique === SolutionTechniqueEnum.Guess) {
            return msg`This reveals the marked cell's digit from the solution.`;
        }

        if (isDefined(step.narration.placement)) {
            return getPlacementRevealNarration(step, techniqueName, valueList);
        }

        return getEliminationRevealNarration(techniqueName, getNarrationFamily(step.narration.technique), valueList);
    }

    if (step.kind === StepScriptStepKindEnum.StrikeCandidates) {
        return getEliminationStrikeNarration(techniqueName, getNarrationFamily(step.narration.technique), valueList);
    }

    return msg`Place ${valueList} in the marked cell.`;
};
