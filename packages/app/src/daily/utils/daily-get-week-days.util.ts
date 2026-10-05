import { getDailyDifficulty } from '@suuudokuuu/puzzle-forge';

import { DailyWeekDayStateEnum } from '../enums/daily-week-day-state.enum';

import { dailyGetDateString } from './daily-get-date-string.util';

import type { DailyWeekDayInterface } from '../interfaces/daily-week-day.interface';

const DailyWeekPastDaysCount = 5;
const DailyWeekLength = 7;

const getDayState = (dayNumber: number, todayDayNumber: number, isSolved: boolean): DailyWeekDayStateEnum => {
    if (dayNumber > todayDayNumber) {
        return DailyWeekDayStateEnum.UPCOMING;
    }

    if (dayNumber === todayDayNumber) {
        return isSolved ? DailyWeekDayStateEnum.TODAY_SOLVED : DailyWeekDayStateEnum.TODAY;
    }

    return isSolved ? DailyWeekDayStateEnum.SOLVED : DailyWeekDayStateEnum.MISSED;
};

export const dailyGetWeekDays = (todayDayNumber: number, completedDayNumbers: readonly number[]): readonly DailyWeekDayInterface[] => {
    const isSolved = (dayNumber: number) => completedDayNumbers.includes(dayNumber);

    return Array.from({ length: DailyWeekLength }, (_unusedValue, offset) => {
        const dayNumber = todayDayNumber - DailyWeekPastDaysCount + offset;
        const isDaySolved = isSolved(dayNumber);

        return {
            dayNumber,
            difficulty: getDailyDifficulty(dailyGetDateString(dayNumber)),
            isLinkedToNext: isDaySolved && isSolved(dayNumber + 1),
            isLinkedToPrevious: isDaySolved && isSolved(dayNumber - 1) && offset > 0,
            state: getDayState(dayNumber, todayDayNumber, isDaySolved)
        };
    });
};
