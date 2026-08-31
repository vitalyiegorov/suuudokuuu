import { describe, expect, it } from '@jest/globals';

import { DAILY_MILLISECONDS_PER_DAY } from '../../@generic/constants/daily-challenge.constant';

import { getDailyDateString } from './get-daily-date-string.util';
import { getDailyDayNumber } from './get-daily-day-number.util';

const sampleDateString = '2026-08-23';
const nextDateString = '2026-08-24';

const utcFirstMillisecond = Date.parse(`${sampleDateString}T00:00:00.000Z`);
const utcLastMillisecond = Date.parse(`${nextDateString}T00:00:00.000Z`) - 1;
const utcNoon = Date.parse(`${sampleDateString}T12:00:00.000Z`);

describe('getDailyDateString', () => {
    it('should format a timestamp as a UTC calendar date', () => {
        expect.assertions(1);

        expect(getDailyDateString(utcNoon)).toBe(sampleDateString);
    });

    it('should keep the whole UTC day on the same date string', () => {
        expect.assertions(2);

        expect(getDailyDateString(utcFirstMillisecond)).toBe(sampleDateString);
        expect(getDailyDateString(utcLastMillisecond)).toBe(sampleDateString);
    });

    it('should roll over at UTC midnight', () => {
        expect.assertions(1);

        expect(getDailyDateString(utcLastMillisecond + 1)).toBe(nextDateString);
    });

    it('should round-trip through the day number', () => {
        expect.assertions(1);

        const dayNumber = getDailyDayNumber(getDailyDateString(utcNoon));

        expect(getDailyDateString(dayNumber * DAILY_MILLISECONDS_PER_DAY)).toBe(sampleDateString);
    });
});

describe('getDailyDayNumber', () => {
    it('should count whole UTC days since the epoch', () => {
        expect.assertions(2);

        expect(getDailyDayNumber('1970-01-01')).toBe(0);
        expect(getDailyDayNumber('1970-01-02')).toBe(1);
    });

    it('should advance by exactly one per calendar day', () => {
        expect.assertions(1);

        expect(getDailyDayNumber(nextDateString) - getDailyDayNumber(sampleDateString)).toBe(1);
    });
});
