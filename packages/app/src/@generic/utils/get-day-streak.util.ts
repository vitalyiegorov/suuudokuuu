import { isDefined } from '@rnw-community/shared';

import { getDayNumber } from '../../@generic/utils/get-day-number.util';

export const historyGetDayStreak = (playedDayNumbers: readonly number[], now = Date.now()): number => {
    const todayDayNumber = getDayNumber(now);
    const uniqueDayNumbers = Array.from(new Set(playedDayNumbers))
        .filter(dayNumber => dayNumber <= todayDayNumber)
        .sort((firstDayNumber, secondDayNumber) => secondDayNumber - firstDayNumber);
    const [latestDayNumber] = uniqueDayNumbers;

    if (!isDefined(latestDayNumber) || latestDayNumber < todayDayNumber - 1) {
        return 0;
    }

    let expectedDayNumber = latestDayNumber;
    let streak = 0;

    for (const dayNumber of uniqueDayNumbers) {
        if (dayNumber !== expectedDayNumber) {
            break;
        }

        streak += 1;
        expectedDayNumber -= 1;
    }

    return streak;
};
