import { getCellKey } from '../../@generic/utils/get-cell-key.util';

import type { CellInterface, Sudoku } from '@suuudokuuu/generator';

export const pruneCandidates = (
    candidates: Record<string, number[]>,
    sudoku: Sudoku,
    correctCell: CellInterface
): Record<string, number[]> => {
    const prunedCandidates = { ...candidates };

    sudoku.Field.forEach(
        row =>
            void row.forEach(cell => {
                if (
                    sudoku.isBlankCell(cell) &&
                    (cell.x === correctCell.x || cell.y === correctCell.y || cell.group === correctCell.group)
                ) {
                    const possibleCandidates = sudoku.getCellCandidates(cell);

                    prunedCandidates[getCellKey(cell)] = (prunedCandidates[getCellKey(cell)] ?? []).filter(candidateValue =>
                        possibleCandidates.includes(candidateValue)
                    );
                }
            })
    );

    return prunedCandidates;
};
