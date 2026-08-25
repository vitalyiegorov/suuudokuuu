import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import type { CellInterface } from '@suuudokuuu/generator';

const blankCellCharacter = '.';

export const gameGetPreMoveSudoku = (sudokuString: string, cell: Pick<CellInterface, 'x' | 'y'>): Sudoku => {
    const cellIndex = cell.y * defaultSudokuConfig.fieldSize + cell.x;
    const preMoveString = `${sudokuString.slice(0, cellIndex)}${blankCellCharacter}${sudokuString.slice(cellIndex + 1)}`;

    return Sudoku.fromString(preMoveString, { ...defaultSudokuConfig });
};
