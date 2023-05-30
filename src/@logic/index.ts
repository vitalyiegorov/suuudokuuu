import { defaultSudokuConfig } from './interfaces/sudoku-config.interface';
import { Sudoku } from './sudoku/sudoku';

export * from './interfaces/sudoku-config.interface';
export * from './interfaces/cell.interface';
export * from './interfaces/field.interface';
export * from './interfaces/scored-cells.interface';

export * from './utils/calculate-score.util';

export const SudokuGame = new Sudoku(defaultSudokuConfig);
