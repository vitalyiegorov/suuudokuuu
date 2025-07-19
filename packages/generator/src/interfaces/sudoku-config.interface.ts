import { DifficultyEnum } from '@suuudokuuu/app/src/@generic/enums/difficulty.enum';

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
        [DifficultyEnum.Newbie]: 0.3,
        [DifficultyEnum.Easy]: 0.5,
        [DifficultyEnum.Medium]: 0.6,
        [DifficultyEnum.Hard]: 0.75,
        [DifficultyEnum.Nightmare]: 0.9
    }
};
