import { msg } from '@lingui/core/macro';
import { StepScriptStepKindEnum } from '@suuudokuuu/field-core';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { isDefined } from '@rnw-community/shared';

import type { MessageDescriptor } from '@lingui/core';
import type { StepScriptStepType } from '@suuudokuuu/field-core';
import type { CellInterface } from '@suuudokuuu/generator';

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

    return msg`${techniqueName}: the highlighted cells leave only ${value} for the marked cell.`;
};

export const gameGetStepNarration = (step: StepScriptStepType, techniqueName: string): MessageDescriptor => {
    const valueList = joinValues(step.narration.values);

    if (step.kind === StepScriptStepKindEnum.RevealCandidates) {
        if (isDefined(step.narration.placement)) {
            return getPlacementRevealNarration(step, techniqueName, valueList);
        }

        return msg`${techniqueName}: the highlighted cells can only hold the digits ${valueList}.`;
    }

    if (step.kind === StepScriptStepKindEnum.StrikeCandidates) {
        return msg`${techniqueName}: the pattern rules ${valueList} out of the marked cells.`;
    }

    return msg`Place ${valueList} in the marked cell.`;
};
