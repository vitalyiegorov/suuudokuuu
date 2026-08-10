import { describe, expect, it } from '@jest/globals';

import {
    winConfettiDegradationDelayMillisecondsConstant,
    winConfettiFrameBudgetMillisecondsConstant,
    winConfettiFrameSmoothingConstant
} from '../constants/win-confetti.constant';

import { getConfettiAverageFrameDuration, isConfettiFrameBudgetExceeded } from './confetti-frame-budget.util';

const smoothFrameDuration = 16;
const jankyFrameDuration = 40;
const precisionDigits = 6;
const earlyElapsedMilliseconds = 100;
const lateElapsedMilliseconds = 2000;

describe('getConfettiAverageFrameDuration', () => {
    it('seeds the average with the first frame duration', () => {
        expect(getConfettiAverageFrameDuration(0, smoothFrameDuration)).toBe(smoothFrameDuration);
    });

    it('moves the average towards the newest frame duration', () => {
        const expected = smoothFrameDuration + (jankyFrameDuration - smoothFrameDuration) * winConfettiFrameSmoothingConstant;

        expect(getConfettiAverageFrameDuration(smoothFrameDuration, jankyFrameDuration)).toBeCloseTo(expected, precisionDigits);
    });

    it('converges on a steady frame duration', () => {
        let average = smoothFrameDuration;
        const steps = 200;

        for (let step = 0; step < steps; step += 1) {
            average = getConfettiAverageFrameDuration(average, jankyFrameDuration);
        }

        expect(average).toBeCloseTo(jankyFrameDuration, precisionDigits);
    });
});

describe('isConfettiFrameBudgetExceeded', () => {
    it('stays quiet during the grace period', () => {
        expect(isConfettiFrameBudgetExceeded(earlyElapsedMilliseconds, jankyFrameDuration)).toBe(false);
        expect(isConfettiFrameBudgetExceeded(winConfettiDegradationDelayMillisecondsConstant, jankyFrameDuration)).toBe(false);
    });

    it('stays quiet while frames are inside the budget', () => {
        expect(isConfettiFrameBudgetExceeded(lateElapsedMilliseconds, smoothFrameDuration)).toBe(false);
        expect(isConfettiFrameBudgetExceeded(lateElapsedMilliseconds, winConfettiFrameBudgetMillisecondsConstant)).toBe(false);
    });

    it('reports slow frames after the grace period', () => {
        expect(isConfettiFrameBudgetExceeded(lateElapsedMilliseconds, jankyFrameDuration)).toBe(true);
    });
});
