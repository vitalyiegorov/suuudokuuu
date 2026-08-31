import { getCellKey } from '@suuudokuuu/field-core';

import { isDefined } from '@rnw-community/shared';

import { BLANK_CELL_VALUE } from '../constants/field-grid.constant';

import { mergeCandidateValues } from './merge-candidate-values.util';

import type { FieldCellViewContextInterface } from '../interfaces/field-cell-view-context.interface';
import type { FieldCellViewInterface } from '../interfaces/field-cell-view.interface';
import type { FieldCellType } from '../types/field-cell.type';

export const buildFieldCellView = (
    cell: FieldCellType,
    candidates: number[],
    context: FieldCellViewContextInterface
): FieldCellViewInterface => {
    const { givenCellKeys, mistakeCell, selectedCell, stepState } = context;
    const key = getCellKey(cell);
    const isSelected = isDefined(selectedCell) && selectedCell.x === cell.x && selectedCell.y === cell.y;
    const isPeerCell =
        isDefined(selectedCell) && (selectedCell.x === cell.x || selectedCell.y === cell.y || selectedCell.group === cell.group);
    const hasSelectedValue = isDefined(selectedCell) && cell.value !== BLANK_CELL_VALUE && cell.value === selectedCell.value;

    return {
        cell,
        key,
        value: cell.value,
        placedValue: stepState.placedValues.get(key) ?? BLANK_CELL_VALUE,
        candidates: mergeCandidateValues(candidates, stepState.revealedCandidates.get(key) ?? []),
        eliminatedCandidates: stepState.eliminatedCandidates.get(key) ?? [],
        isGiven: givenCellKeys.has(key),
        isSelected,
        isHighlighted: isPeerCell && !isSelected,
        isSameValue: hasSelectedValue && !isSelected,
        isWrong: isDefined(mistakeCell) && mistakeCell.x === cell.x && mistakeCell.y === cell.y,
        isPatternCell: stepState.patternCellKeys.has(key),
        isTargetCell: stepState.targetCellKey === key
    };
};
