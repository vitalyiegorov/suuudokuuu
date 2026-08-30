import { getDailyDifficulty } from '@suuudokuuu/puzzle-forge';

import { dailyGetDateString } from './daily-get-date-string.util';

import type { DifficultyEnum } from '@suuudokuuu/generator';

const DailyHistoryLength = 10;

export interface DailyCompletedDayInterface {
    readonly dayNumber: number;
    readonly difficulty: DifficultyEnum;
}

export const dailyGetCompletedDays = (completedDayNumbers: readonly number[]): readonly DailyCompletedDayInterface[] =>
    [...completedDayNumbers]
        .sort((firstDayNumber, secondDayNumber) => secondDayNumber - firstDayNumber)
        .slice(0, DailyHistoryLength)
        .map(dayNumber => ({ dayNumber, difficulty: getDailyDifficulty(dailyGetDateString(dayNumber)) }));
