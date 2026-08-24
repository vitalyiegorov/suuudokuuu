import type { CellInterface, Sudoku } from '@suuudokuuu/generator';

export const gameGetArrowTargetCell = (sudoku: Sudoku, currentCell: CellInterface, key: string): CellInterface | undefined => {
    if (key === 'ArrowUp') {
        return sudoku.getCellUp(currentCell);
    }
    if (key === 'ArrowDown') {
        return sudoku.getCellDown(currentCell);
    }
    if (key === 'ArrowLeft') {
        return sudoku.getCellLeft(currentCell);
    }

    return sudoku.getCellRight(currentCell);
};
