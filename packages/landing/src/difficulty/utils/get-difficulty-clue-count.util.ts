import { defaultSudokuConfig } from '@suuudokuuu/generator';
import { DIFFICULTY_BANDS } from '@suuudokuuu/puzzle-forge';

import type { DifficultyEnum } from '@suuudokuuu/generator';

const CELL_COUNT = defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize;

export const getDifficultyClueCount = (difficulty: DifficultyEnum): number => CELL_COUNT - DIFFICULTY_BANDS[difficulty].blankCells;
