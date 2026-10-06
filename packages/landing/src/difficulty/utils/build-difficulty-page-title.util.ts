import { DIFFICULTY_NAMES } from '../constants/difficulty-name.constant';

import type { DifficultyEnum } from '@suuudokuuu/generator';

export const buildDifficultyPageTitle = (difficulty: DifficultyEnum): string => `${DIFFICULTY_NAMES[difficulty]} Sudoku`;
