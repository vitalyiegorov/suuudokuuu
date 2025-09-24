import { DifficultyEnum } from '../enums/difficulty.enum';

import { type SudokuScoringConfigInterface, defaultSudokuScoringConfig } from './sudoku-scoring-config.interface';

export interface SudokuConfigInterface {
    difficulty: DifficultyEnum;
    fieldSize: number;
    fieldGroupWidth: number;
    fieldGroupHeight: number;
    blankCellValue: number;
    score: SudokuScoringConfigInterface;
    difficultyBlankCells: Record<DifficultyEnum, number>;
}

export const defaultSudokuConfig: SudokuConfigInterface = {
    difficulty: DifficultyEnum.Newbie,
    score: defaultSudokuScoringConfig,
    fieldSize: 9,
    fieldGroupWidth: 3,
    fieldGroupHeight: 3,
    blankCellValue: 0,
    difficultyBlankCells: {
        [DifficultyEnum.Newbie]: 10,
        [DifficultyEnum.Easy]: 30,
        [DifficultyEnum.Medium]: 40,
        [DifficultyEnum.Hard]: 50,
        [DifficultyEnum.Nightmare]: 60
    }
};

export const getBlankCellCountByConfig = (config: SudokuConfigInterface): number => config.difficultyBlankCells[config.difficulty];
