import { DifficultyEnum } from '../enums/difficulty.enum';

export interface SudokuConfigInterface {
    difficulty: DifficultyEnum;
    fieldSize: number;
    fieldGroupWidth: number;
    fieldGroupHeight: number;
    blankCellValue: number;
    difficultyBlankCells: Record<DifficultyEnum, number>;
}

export const defaultSudokuConfig: SudokuConfigInterface = {
    difficulty: DifficultyEnum.Newbie,
    fieldSize: 9,
    fieldGroupWidth: 3,
    fieldGroupHeight: 3,
    blankCellValue: 0,
    difficultyBlankCells: {
        [DifficultyEnum.Newbie]: 10,
        [DifficultyEnum.Easy]: 30,
        [DifficultyEnum.Medium]: 40,
        [DifficultyEnum.Hard]: 50,
        [DifficultyEnum.Nightmare]: 59,
        [DifficultyEnum.Hell]: 64
    }
};

export const getBlankCellCountByConfig = (config: SudokuConfigInterface): number => config.difficultyBlankCells[config.difficulty];
