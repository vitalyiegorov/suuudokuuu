import { isDefined } from '@rnw-community/shared';

export const getDayStreak = (dayNumbers: readonly number[], todayDayNumber: number): number => {
    const uniqueDayNumbers = Array.from(new Set(dayNumbers))
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
