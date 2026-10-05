import { getDailyDifficulty } from '@suuudokuuu/puzzle-forge';

import { dailyGetDateString } from './daily-get-date-string.util';

import type { DifficultyEnum } from '@suuudokuuu/generator';
import type { DailyResultType } from '@suuudokuuu/progress';

const DailyHistoryLength = 10;

export interface DailyCompletedDayInterface {
    readonly dayNumber: number;
    readonly difficulty: DifficultyEnum;
    readonly result: DailyResultType | undefined;
}

export const dailyGetCompletedDays = (
    completedDayNumbers: readonly number[],
    todayDayNumber: number,
    dailyResults: readonly DailyResultType[]
): readonly DailyCompletedDayInterface[] =>
    completedDayNumbers
        .filter(dayNumber => dayNumber !== todayDayNumber)
        .sort((firstDayNumber, secondDayNumber) => secondDayNumber - firstDayNumber)
        .slice(0, DailyHistoryLength)
        .map(dayNumber => ({
            dayNumber,
            difficulty: getDailyDifficulty(dailyGetDateString(dayNumber)),
            result: dailyResults.find(dailyResult => dailyResult.dailyDayNumber === dayNumber)
        }));
