import { getCellKey } from '../../@generic/utils/get-cell-key.util';

import type { FieldCandidatesType } from '../types/field-candidates.type';
import type { CellInterface, Sudoku } from '@suuudokuuu/generator';

const isPeerCell = (cell: CellInterface, placedCell: CellInterface): boolean =>
    cell.x === placedCell.x || cell.y === placedCell.y || cell.group === placedCell.group;

export const pruneCandidates = (sudoku: Sudoku, candidates: FieldCandidatesType, placedCell: CellInterface): FieldCandidatesType => {
    const prunedCandidates: FieldCandidatesType = { ...candidates, [getCellKey(placedCell)]: [] };

    for (const row of sudoku.Field) {
        for (const cell of row) {
            if (sudoku.isBlankCell(cell) && isPeerCell(cell, placedCell)) {
                const possibleCandidates = sudoku.getCellCandidates(cell);
                const cellKey = getCellKey(cell);

                prunedCandidates[cellKey] = (prunedCandidates[cellKey] ?? []).filter(candidate => possibleCandidates.includes(candidate));
            }
        }
    }

    return prunedCandidates;
};
