import { isDefined } from '@rnw-community/shared';

import type { CompletedGameInterface } from '../interfaces/completed-game.interface';

const HoursPerDay = 24;
const DayInMilliseconds = HoursPerDay * 60 * 60 * 1000;

const getLocalDayNumber = (timestamp: number) => {
    const date = new Date(timestamp);

    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DayInMilliseconds;
};

export const historyGetDayStreak = (completedGames: readonly CompletedGameInterface[], now = Date.now()) => {
    const todayDayNumber = getLocalDayNumber(now);
    const completedDayNumbers = completedGames
        .map(game => getLocalDayNumber(game.completedAt))
        .filter(dayNumber => dayNumber <= todayDayNumber);
    const uniqueCompletedDayNumbers = Array.from(new Set(completedDayNumbers)).sort(
        (firstDayNumber, secondDayNumber) => secondDayNumber - firstDayNumber
    );
    const [latestDayNumber] = uniqueCompletedDayNumbers;

    if (!isDefined(latestDayNumber) || latestDayNumber < todayDayNumber - 1) {
        return 0;
    }

    let expectedDayNumber = latestDayNumber;
    let streak = 0;

    for (const dayNumber of uniqueCompletedDayNumbers) {
        if (dayNumber !== expectedDayNumber) {
            break;
        }

        streak += 1;
        expectedDayNumber -= 1;
    }

    return streak;
};
