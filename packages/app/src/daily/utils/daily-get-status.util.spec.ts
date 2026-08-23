import { describe, expect, it } from '@jest/globals';

import { dailyGetStatus } from './daily-get-status.util';

const TodayDayNumber = 20688;
const NoRunDayNumber = 0;

describe('dailyGetStatus', () => {
    it('offers the daily when it was never started', () => {
        expect.assertions(1);

        expect(dailyGetStatus(TodayDayNumber, [], NoRunDayNumber)).toBe('available');
    });

    it('reports a run started today as in progress', () => {
        expect.assertions(1);

        expect(dailyGetStatus(TodayDayNumber, [], TodayDayNumber)).toBe('inProgress');
    });

    it('reports today as completed once it was solved', () => {
        expect.assertions(1);

        expect(dailyGetStatus(TodayDayNumber, [TodayDayNumber], NoRunDayNumber)).toBe('completed');
    });

    it('prefers completed over in progress so a finished run never offers Continue', () => {
        expect.assertions(1);

        expect(dailyGetStatus(TodayDayNumber, [TodayDayNumber], TodayDayNumber)).toBe('completed');
    });

    it('offers a fresh daily after the midnight rollover even while yesterday is still the run of record', () => {
        expect.assertions(1);

        expect(dailyGetStatus(TodayDayNumber, [TodayDayNumber - 1], TodayDayNumber - 1)).toBe('available');
    });

    it('never treats an older completed day as today', () => {
        expect.assertions(1);

        expect(dailyGetStatus(TodayDayNumber, [TodayDayNumber - 2, TodayDayNumber - 1], NoRunDayNumber)).toBe('available');
    });
});
