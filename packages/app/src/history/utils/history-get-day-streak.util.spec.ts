import { describe, expect, it } from '@jest/globals';

import { getDayNumber } from '../../@generic/utils/get-day-number.util';

import { historyGetDayStreak } from './history-get-day-streak.util';

const TestYear = 2026;
const TestMonth = 5;
const TodayDate = 29;
const StaleDate = 26;
const NoonHour = 12;

describe('historyGetDayStreak', () => {
    it('counts consecutive played days ending today', () => {
        expect.assertions(1);

        const now = new Date(TestYear, TestMonth, TodayDate, NoonHour).getTime();
        const todayDayNumber = getDayNumber(now);
        const playedDayNumbers = [todayDayNumber, todayDayNumber - 1, todayDayNumber - 2];

        expect(historyGetDayStreak(playedDayNumbers, now)).toBe(3);
    });

    it('keeps the streak alive when the latest played day was yesterday', () => {
        expect.assertions(1);

        const now = new Date(TestYear, TestMonth, TodayDate, NoonHour).getTime();
        const todayDayNumber = getDayNumber(now);
        const playedDayNumbers = [todayDayNumber - 1, todayDayNumber - 2];

        expect(historyGetDayStreak(playedDayNumbers, now)).toBe(2);
    });

    it('stops counting at the first missed day', () => {
        expect.assertions(1);

        const now = new Date(TestYear, TestMonth, TodayDate, NoonHour).getTime();
        const todayDayNumber = getDayNumber(now);
        const playedDayNumbers = [todayDayNumber, todayDayNumber - 2];

        expect(historyGetDayStreak(playedDayNumbers, now)).toBe(1);
    });

    it('resets when the latest played day is older than yesterday', () => {
        expect.assertions(1);

        const now = new Date(TestYear, TestMonth, TodayDate, NoonHour).getTime();
        const staleDayNumber = getDayNumber(new Date(TestYear, TestMonth, StaleDate, NoonHour).getTime());

        expect(historyGetDayStreak([staleDayNumber], now)).toBe(0);
    });

    it('deduplicates repeated day numbers from multiple games played on the same day', () => {
        expect.assertions(1);

        const now = new Date(TestYear, TestMonth, TodayDate, NoonHour).getTime();
        const todayDayNumber = getDayNumber(now);
        const playedDayNumbers = [todayDayNumber, todayDayNumber, todayDayNumber - 1];

        expect(historyGetDayStreak(playedDayNumbers, now)).toBe(2);
    });

    it('returns zero for an empty history', () => {
        expect.assertions(1);

        expect(historyGetDayStreak([])).toBe(0);
    });
});
