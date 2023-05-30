import { defaultSudokuConfig } from './interfaces/sudoku-config.interface';
import { Sudoku } from './sudoku/sudoku';

export * from './interfaces/sudoku-config.interface';
export * from './interfaces/cell.interface';
export * from './interfaces/field.interface';
export * from './interfaces/scored-cells.interface';

export * from './constants/score.constant';
export * from './constants/field.constant';
export * from './constants/max-mistakes.constant';
export * from './constants/blank-cell-value.constant';

export * from './utils/calculate-score.util';

export const SudokuGame = new Sudoku(defaultSudokuConfig);
