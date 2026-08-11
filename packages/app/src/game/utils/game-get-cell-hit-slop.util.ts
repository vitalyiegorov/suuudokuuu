import { isPositiveNumber } from '@rnw-community/shared';

import type { CellInterface, Sudoku } from '@suuudokuuu/generator';
import type { Insets } from 'react-native';

export const gameGetCellHitSlop = (sudoku: Sudoku, cell: CellInterface, cellMargin: number): Insets => {
    const gapReach = Math.floor(cellMargin / 2);
    const hasGapAfterColumn = sudoku.isLastInCellGroupX(cell);
    const hasGapBeforeColumn = isPositiveNumber(cell.x) && sudoku.isLastInCellGroupX({ ...cell, x: cell.x - 1 });
    const hasGapAfterRow = sudoku.isLastInCellGroupY(cell);
    const hasGapBeforeRow = isPositiveNumber(cell.y) && sudoku.isLastInCellGroupY({ ...cell, y: cell.y - 1 });

    return {
        bottom: hasGapAfterRow ? gapReach : 0,
        left: hasGapBeforeColumn ? gapReach : 0,
        right: hasGapAfterColumn ? gapReach : 0,
        top: hasGapBeforeRow ? gapReach : 0
    };
};
