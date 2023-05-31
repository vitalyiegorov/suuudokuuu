import { DifficultyEnum } from '../../@generic/enums/difficulty.enum';

import { type SudokuScoringConfigInterface, defaultSudokuScoringConfig } from './sudoku-scoring-config.interface';

export interface SudokuConfigInterface {
    difficulty: DifficultyEnum;
    fieldSize: number;
    fieldGroupWidth: number;
    fieldGroupHeight: number;
    blankCellValue: number;
    score: SudokuScoringConfigInterface;
    difficultyBlankCellsPercentage: Record<DifficultyEnum, number>;
}

export const defaultSudokuConfig: SudokuConfigInterface = {
    difficulty: DifficultyEnum.Newbie,
    score: defaultSudokuScoringConfig,
    fieldSize: 9,
    fieldGroupWidth: 3,
    fieldGroupHeight: 3,
    blankCellValue: 0,
    difficultyBlankCellsPercentage: {
        [DifficultyEnum.Newbie]: 0.03,
        [DifficultyEnum.Easy]: 0.2,
        [DifficultyEnum.Medium]: 0.4,
        [DifficultyEnum.Hard]: 0.65,
        [DifficultyEnum.Nightmare]: 0.85
    }
};
