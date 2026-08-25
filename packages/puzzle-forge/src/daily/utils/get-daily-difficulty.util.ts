import { DAILY_DIFFICULTY_LADDER } from '../../@generic/constants/daily-challenge.constant';

import { getDailyDayNumber } from './get-daily-day-number.util';

import type { DifficultyEnum } from '@suuudokuuu/generator';

export const getDailyDifficulty = (dateString: string): DifficultyEnum =>
    DAILY_DIFFICULTY_LADDER[getDailyDayNumber(dateString) % DAILY_DIFFICULTY_LADDER.length];
