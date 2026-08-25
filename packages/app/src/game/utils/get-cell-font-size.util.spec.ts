/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it } from '@jest/globals';

import { CandidateFontSizeCapDivider, CellFontSizeCapDivider } from '../constant/font-size.constant';

import { getCandidateFontSize } from './get-candidate-font-size.util';
import { getCellFontSize } from './get-cell-font-size.util';

const NoSystemScale = 1;

describe('getCellFontSize', () => {
    it('should scale the cell value with the cell size and the multiplier', () => {
        expect.assertions(2);

        expect(getCellFontSize(50, 1, NoSystemScale)).toBe(20);
        expect(getCellFontSize(50, 1.2, NoSystemScale)).toBe(24);
    });

    it('should stay positive while the board has not been measured yet', () => {
        expect.assertions(2);

        expect(getCellFontSize(0, 1, NoSystemScale)).toBeGreaterThan(0);
        expect(getCellFontSize(-10, 1, NoSystemScale)).toBeGreaterThan(0);
    });

    it('should enlarge the cell value with the system font scale', () => {
        expect.assertions(2);

        expect(getCellFontSize(50, 1, 1.2)).toBeCloseTo(24);
        expect(getCellFontSize(50, 1, 1.5)).toBeGreaterThan(getCellFontSize(50, 1, 1.2));
    });

    it('should clamp the system font scale to what the cell can fit', () => {
        expect.assertions(2);

        expect(getCellFontSize(50, 1, 3)).toBeCloseTo(50 / CellFontSizeCapDivider);
        expect(getCellFontSize(50, 1.75, 2)).toBeCloseTo(50 / CellFontSizeCapDivider);
    });

    it('should never shrink the cell value below the in-app font size setting', () => {
        expect.assertions(2);

        expect(getCellFontSize(50, 1, 0.8)).toBe(20);
        expect(getCellFontSize(50, 1.2, 0.5)).toBe(24);
    });

    it('should keep every in-app font size setting unchanged at the default system scale', () => {
        expect.assertions(4);

        expect(getCellFontSize(50, 0.6, NoSystemScale)).toBe(12);
        expect(getCellFontSize(50, 0.8, NoSystemScale)).toBe(16);
        expect(getCellFontSize(50, 1.25, NoSystemScale)).toBe(25);
        expect(getCellFontSize(50, 1.75, NoSystemScale)).toBe(35);
    });
});

describe('getCandidateFontSize', () => {
    it('should cap the candidate size so nine candidates keep fitting the cell', () => {
        expect.assertions(1);

        expect(getCandidateFontSize(37, 1.4, NoSystemScale)).toBe(10);
    });

    it('should scale with the multiplier while it stays under the cap', () => {
        expect.assertions(2);

        expect(getCandidateFontSize(30, 0.5, NoSystemScale)).toBe(5);
        expect(getCandidateFontSize(30, 1, NoSystemScale)).toBeCloseTo(30 / CandidateFontSizeCapDivider);
    });

    it('should stay positive while the board has not been measured yet', () => {
        expect.assertions(2);

        expect(getCandidateFontSize(0, 1, NoSystemScale)).toBeGreaterThan(0);
        expect(getCandidateFontSize(-10, 1.4, NoSystemScale)).toBeGreaterThan(0);
    });

    it('should enlarge small candidates with the system font scale', () => {
        expect.assertions(1);

        expect(getCandidateFontSize(30, 0.5, 1.5)).toBe(7.5);
    });

    it('should clamp the system font scale to the candidate grid', () => {
        expect.assertions(1);

        expect(getCandidateFontSize(30, 0.5, 3)).toBeCloseTo(30 / CandidateFontSizeCapDivider);
    });

    it('should never shrink candidates below the in-app font size setting', () => {
        expect.assertions(1);

        expect(getCandidateFontSize(30, 0.5, 0.8)).toBe(5);
    });
});
