import { describe, expect, it } from '@jest/globals';

import { compositeColors } from './composite-colors.util';
import { getContrastRatio } from './get-contrast-ratio.util';

const white = { red: 255, green: 255, blue: 255, alpha: 1 };
const black = { red: 0, green: 0, blue: 0, alpha: 1 };

const maxWcagContrastRatio = 21;
const knownGrayOnWhiteMinimumRatio = 4.5;
const knownGrayOnWhiteMaximumRatio = 4.6;
const midGrayBlendedRedChannel = 127.5;

describe('getContrastRatio', () => {
    it('returns 21 for black on white', () => {
        expect(getContrastRatio(black, white)).toBeCloseTo(maxWcagContrastRatio, 1);
    });

    it('returns 1 for identical colors', () => {
        expect(getContrastRatio(white, white)).toBeCloseTo(1, 5);
    });

    it('is symmetric', () => {
        const gray = { red: 118, green: 118, blue: 118, alpha: 1 };
        expect(getContrastRatio(gray, white)).toBeCloseTo(getContrastRatio(white, gray), 5);
    });

    it('matches the known #767676-on-white ratio of ~4.54', () => {
        const gray = { red: 118, green: 118, blue: 118, alpha: 1 };
        expect(getContrastRatio(gray, white)).toBeGreaterThan(knownGrayOnWhiteMinimumRatio);
        expect(getContrastRatio(gray, white)).toBeLessThan(knownGrayOnWhiteMaximumRatio);
    });
});

describe('compositeColors', () => {
    it('returns the foreground unchanged when opaque', () => {
        expect(compositeColors(black, white)).toEqual(black);
    });

    it('blends a 50% black over white into mid gray', () => {
        const result = compositeColors({ ...black, alpha: 0.5 }, white);
        expect(result.red).toBeCloseTo(midGrayBlendedRedChannel, 0);
        expect(result.alpha).toBe(1);
    });
});
