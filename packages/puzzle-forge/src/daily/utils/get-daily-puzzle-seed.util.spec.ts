import { describe, expect, it } from '@jest/globals';

import { DAILY_DIFFICULTY_LADDER, DAILY_MILLISECONDS_PER_DAY } from '../../@generic/constants/daily-challenge.constant';

import { getDailyDayNumber } from './get-daily-day-number.util';
import { getDailyDifficulty } from './get-daily-difficulty.util';
import { getDailyPuzzleSeed } from './get-daily-puzzle-seed.util';

const sampleDateString = '2026-08-23';
const sampleDayCount = 400;
const DATE_STRING_LENGTH = 10;
const maxUint32 = 0xffff_ffff;
const publishedSampleSeed = 2_317_164_260;

const getDateStringByOffset = (dayOffset: number): string =>
    new Date((getDailyDayNumber(sampleDateString) + dayOffset) * DAILY_MILLISECONDS_PER_DAY).toISOString().slice(0, DATE_STRING_LENGTH);

describe('getDailyPuzzleSeed', () => {
    it('should be a stable unsigned 32-bit value for a given date', () => {
        expect.assertions(3);

        const seed = getDailyPuzzleSeed(sampleDateString);

        expect(seed).toBe(getDailyPuzzleSeed(sampleDateString));
        expect(seed).toBeGreaterThanOrEqual(0);
        expect(seed).toBeLessThanOrEqual(maxUint32);
    });

    it('should pin the published derivation so a future archive page can reproduce it', () => {
        expect.assertions(1);

        expect(getDailyPuzzleSeed(sampleDateString)).toBe(publishedSampleSeed);
    });

    it('should give every date in a year a distinct seed', () => {
        expect.assertions(1);

        const seeds = new Set(
            Array.from({ length: sampleDayCount }, (_, dayOffset) => getDailyPuzzleSeed(getDateStringByOffset(dayOffset)))
        );

        expect(seeds.size).toBe(sampleDayCount);
    });

    it('should change when a single date character changes', () => {
        expect.assertions(1);

        expect(getDailyPuzzleSeed('2026-08-23')).not.toBe(getDailyPuzzleSeed('2026-08-24'));
    });
});

describe('getDailyDifficulty', () => {
    it('should rotate through the ladder one tier per day', () => {
        expect.assertions(DAILY_DIFFICULTY_LADDER.length);

        const startIndex = getDailyDayNumber(sampleDateString) % DAILY_DIFFICULTY_LADDER.length;

        for (let dayOffset = 0; dayOffset < DAILY_DIFFICULTY_LADDER.length; dayOffset += 1) {
            const expected = DAILY_DIFFICULTY_LADDER[(startIndex + dayOffset) % DAILY_DIFFICULTY_LADDER.length];

            expect(getDailyDifficulty(getDateStringByOffset(dayOffset))).toBe(expected);
        }
    });

    it('should only ever pick a generated tier below Nightmare', () => {
        expect.assertions(1);

        const difficulties = new Set(
            Array.from({ length: sampleDayCount }, (_, dayOffset) => getDailyDifficulty(getDateStringByOffset(dayOffset)))
        );

        expect([...difficulties].sort()).toStrictEqual([...DAILY_DIFFICULTY_LADDER].sort());
    });
});
