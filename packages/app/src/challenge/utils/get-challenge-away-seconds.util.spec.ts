/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it } from '@jest/globals';

import { getChallengeAwaySeconds } from './get-challenge-away-seconds.util';

describe('getChallengeAwaySeconds', () => {
    it('should add up every away period', () => {
        expect.assertions(1);

        const ranges = [
            { durationSeconds: 12, endPercent: 20, startPercent: 10 },
            { durationSeconds: 30, endPercent: 80, startPercent: 50 }
        ];

        expect(getChallengeAwaySeconds(ranges)).toBe(42);
    });

    it('should report no away time for an uninterrupted run', () => {
        expect.assertions(1);

        expect(getChallengeAwaySeconds([])).toBe(0);
    });
});
