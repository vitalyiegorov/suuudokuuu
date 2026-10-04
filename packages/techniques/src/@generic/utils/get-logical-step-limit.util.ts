import type { Sudoku } from '@suuudokuuu/generator';

export const getLogicalStepLimit = (sudoku: Sudoku): number => {
    const { fieldSize } = sudoku.Config;

    return fieldSize * fieldSize * (fieldSize + 1);
};
