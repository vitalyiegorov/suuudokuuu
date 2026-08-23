import { PUZZLE_FORGE_MAX_ATTEMPTS } from '../../@generic/constants/difficulty-band.constant';
import { forgePuzzle } from '../../forge/utils/forge-puzzle.util';

import { getDailyDifficulty } from './get-daily-difficulty.util';
import { getDailyPuzzleSeed } from './get-daily-puzzle-seed.util';

import type { ForgedPuzzleInterface } from '../../@generic/interfaces/forged-puzzle.interface';

export const forgeDailyPuzzle = (dateString: string, maxAttempts: number = PUZZLE_FORGE_MAX_ATTEMPTS): ForgedPuzzleInterface =>
    forgePuzzle(getDailyDifficulty(dateString), maxAttempts, getDailyPuzzleSeed(dateString));
