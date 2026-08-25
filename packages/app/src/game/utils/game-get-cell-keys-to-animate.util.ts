import { getCellKey } from '@suuudokuuu/field-core';

import type { ScoredCellsInterface, Sudoku } from '@suuudokuuu/generator';

export const gameGetCellKeysToAnimate = (sudoku: Sudoku, scored: ScoredCellsInterface) => {
    const newAnimatedCells = new Set<string>();

    sudoku.Field.forEach(row => {
        row.forEach(cell => {
            if (sudoku.isScoredCell(cell, scored)) {
                newAnimatedCells.add(getCellKey(cell));
            }
        });
    });

    return newAnimatedCells;
};
