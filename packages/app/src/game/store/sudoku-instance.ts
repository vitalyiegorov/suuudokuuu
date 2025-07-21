import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import type { DifficultyEnum } from '@suuudokuuu/generator';

export let sudoku = new Sudoku(defaultSudokuConfig);

export const initializeSudokuFromString = (fieldsString: string): void => {
    sudoku = Sudoku.fromString(fieldsString, defaultSudokuConfig);
};

export const createSudokuGame = (difficulty: DifficultyEnum): void => {
    sudoku = new Sudoku(defaultSudokuConfig);
    sudoku.create(difficulty);
};