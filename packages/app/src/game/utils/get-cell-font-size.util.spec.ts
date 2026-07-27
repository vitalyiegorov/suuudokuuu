/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it } from '@jest/globals';

import { getCandidateFontSize } from './get-candidate-font-size.util';
import { getCellFontSize } from './get-cell-font-size.util';

describe('getCellFontSize', () => {
    it('should scale the cell value with the cell size and the multiplier', () => {
        expect.assertions(2);

        expect(getCellFontSize(50, 1)).toBe(20);
        expect(getCellFontSize(50, 1.2)).toBe(24);
    });

    it('should stay positive while the board has not been measured yet', () => {
        expect.assertions(2);

        expect(getCellFontSize(0, 1)).toBeGreaterThan(0);
        expect(getCellFontSize(-10, 1)).toBeGreaterThan(0);
    });
});

describe('getCandidateFontSize', () => {
    it('should cap the candidate size so nine candidates keep fitting the cell', () => {
        expect.assertions(1);

        expect(getCandidateFontSize(37, 1.4)).toBe(10);
    });

    it('should scale with the multiplier while it stays under the cap', () => {
        expect.assertions(2);

        expect(getCandidateFontSize(30, 0.5)).toBe(5);
        expect(getCandidateFontSize(30, 1)).toBeCloseTo(30 / 3.7);
    });

    it('should stay positive while the board has not been measured yet', () => {
        expect.assertions(2);

        expect(getCandidateFontSize(0, 1)).toBeGreaterThan(0);
        expect(getCandidateFontSize(-10, 1.4)).toBeGreaterThan(0);
    });
});
