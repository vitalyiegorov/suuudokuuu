import { describe, expect, it } from '@jest/globals';

import { getDayStreak } from './get-day-streak.util';

const TodayDayNumber = 20688;

describe('getDayStreak', () => {
    it('counts consecutive played days ending today', () => {
        expect.assertions(1);

        expect(getDayStreak([TodayDayNumber, TodayDayNumber - 1, TodayDayNumber - 2], TodayDayNumber)).toBe(3);
    });

    it('keeps the streak alive when the latest played day was yesterday', () => {
        expect.assertions(1);

        expect(getDayStreak([TodayDayNumber - 1, TodayDayNumber - 2], TodayDayNumber)).toBe(2);
    });

    it('stops counting at the first missed day', () => {
        expect.assertions(1);

        expect(getDayStreak([TodayDayNumber, TodayDayNumber - 2], TodayDayNumber)).toBe(1);
    });

    it('resets when the latest played day is older than yesterday', () => {
        expect.assertions(1);

        expect(getDayStreak([TodayDayNumber - 3], TodayDayNumber)).toBe(0);
    });

    it('deduplicates repeated day numbers from multiple games played on the same day', () => {
        expect.assertions(1);

        expect(getDayStreak([TodayDayNumber, TodayDayNumber, TodayDayNumber - 1], TodayDayNumber)).toBe(2);
    });

    it('ignores day numbers from the future', () => {
        expect.assertions(1);

        expect(getDayStreak([TodayDayNumber + 1, TodayDayNumber, TodayDayNumber - 1], TodayDayNumber)).toBe(2);
    });

    it('returns zero for an empty history', () => {
        expect.assertions(1);

        expect(getDayStreak([], TodayDayNumber)).toBe(0);
    });

    it('survives the midnight rollover by dropping the streak only after a whole day is missed', () => {
        expect.assertions(2);

        const playedDayNumbers = [TodayDayNumber - 1, TodayDayNumber - 2];

        expect(getDayStreak(playedDayNumbers, TodayDayNumber)).toBe(2);
        expect(getDayStreak(playedDayNumbers, TodayDayNumber + 1)).toBe(0);
    });
});
