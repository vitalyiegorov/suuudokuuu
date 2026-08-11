import { describe, expect, it } from '@jest/globals';

import { getDayNumber } from './get-day-number.util';

const TestYear = 2026;
const TestMonth = 5;
const TestDate = 29;
const MorningHour = 8;
const EveningHour = 23;

describe('getDayNumber', () => {
    it('should return the same day number for two timestamps on the same local day', () => {
        expect.assertions(1);

        const morning = new Date(TestYear, TestMonth, TestDate, MorningHour).getTime();
        const evening = new Date(TestYear, TestMonth, TestDate, EveningHour).getTime();

        expect(getDayNumber(morning)).toBe(getDayNumber(evening));
    });

    it('should return consecutive day numbers for consecutive local days', () => {
        expect.assertions(1);

        const today = new Date(TestYear, TestMonth, TestDate, MorningHour).getTime();
        const tomorrow = new Date(TestYear, TestMonth, TestDate + 1, MorningHour).getTime();

        expect(getDayNumber(tomorrow)).toBe(getDayNumber(today) + 1);
    });
});
