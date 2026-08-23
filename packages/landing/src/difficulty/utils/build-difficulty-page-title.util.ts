import { DIFFICULTY_NAMES } from '../constants/difficulty-name.constant';

import type { LandingDifficultyType } from '../types/landing-difficulty.type';

export const buildDifficultyPageTitle = (difficulty: LandingDifficultyType): string => `${DIFFICULTY_NAMES[difficulty]} Sudoku`;
