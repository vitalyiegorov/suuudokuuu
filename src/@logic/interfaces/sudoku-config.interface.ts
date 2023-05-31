import { BlankCellValueConstant } from '../constants/blank-cell-value.constant';

import { type SudokuScoringConfigInterface, defaultSudokuScoringConfig } from './sudoku-scoring-config.interface';

export interface SudokuConfigInterface {
    fieldSize: number;
    fieldGroupWidth: number;
    fieldGroupHeight: number;
    blankCellValue: number;
    score: SudokuScoringConfigInterface;
}

export const defaultSudokuConfig: SudokuConfigInterface = {
    score: defaultSudokuScoringConfig,
    fieldSize: 9,
    fieldGroupWidth: 3,
    fieldGroupHeight: 3,
    blankCellValue: BlankCellValueConstant
};
