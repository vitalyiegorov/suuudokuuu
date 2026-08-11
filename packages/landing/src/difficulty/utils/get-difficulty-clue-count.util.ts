import { defaultSudokuConfig } from '@suuudokuuu/generator';

import type { DifficultyEnum } from '@suuudokuuu/generator';

const CELL_COUNT = defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize;

export const getDifficultyClueCount = (difficulty: DifficultyEnum): number =>
    CELL_COUNT - defaultSudokuConfig.difficultyBlankCells[difficulty];
