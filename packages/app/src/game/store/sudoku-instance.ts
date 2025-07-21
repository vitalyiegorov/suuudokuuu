import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import type { DifficultyEnum } from '@suuudokuuu/generator';

/**
 * Global sudoku instance singleton
 * This instance is used across all game components to avoid prop drilling
 */
export const sudokuInstance = new Sudoku(defaultSudokuConfig);

/**
 * Initialize sudoku instance from string (used when resuming game)
 */
export const initializeSudokuFromString = (fieldsString: string): void => {
    const newSudoku = Sudoku.fromString(fieldsString, defaultSudokuConfig);
    
    // Copy all properties from the new instance to the singleton
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Object.setPrototypeOf(sudokuInstance, Object.getPrototypeOf(newSudoku));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    Object.assign(sudokuInstance, newSudoku as Record<string, unknown>);
};

/**
 * Create new sudoku game with specified difficulty
 */
export const createSudokuGame = (difficulty: DifficultyEnum): void => {
    // Reset the instance to initial state
    Object.assign(sudokuInstance, new Sudoku(defaultSudokuConfig));
    sudokuInstance.create(difficulty);
};