import { describe, expect, it } from '@jest/globals';

import { historyGetWinRate } from './history-get-win-rate.util';

const HalfPercent = 50;
const TwoThirdsRounded = 67;
const NegativeCompletedCount = -2;
const FullPercent = 100;

describe('historyGetWinRate', () => {
    it('should return the rounded percentage of games won', () => {
        expect.assertions(2);

        expect(historyGetWinRate(1, 2)).toBe(HalfPercent);
        expect(historyGetWinRate(2, 3)).toBe(TwoThirdsRounded);
    });

    it('should return zero when no games were completed', () => {
        expect.assertions(1);

        expect(historyGetWinRate(0, 0)).toBe(0);
    });

    it('should return zero rather than a negative rate for a negative completed count', () => {
        expect.assertions(1);

        expect(historyGetWinRate(1, NegativeCompletedCount)).toBe(0);
    });

    it('should return a full rate when every completed game was won', () => {
        expect.assertions(1);

        expect(historyGetWinRate(4, 4)).toBe(FullPercent);
    });
});
