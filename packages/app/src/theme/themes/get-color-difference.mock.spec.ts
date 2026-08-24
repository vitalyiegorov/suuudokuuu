import { describe, expect, it } from '@jest/globals';

import { getColorDifference, getLightnessDifference } from './get-color-difference.util';

const white = { red: 255, green: 255, blue: 255, alpha: 1 };
const black = { red: 0, green: 0, blue: 0, alpha: 1 };
const nearBlack = { red: 2, green: 2, blue: 2, alpha: 1 };
const midGray = { red: 119, green: 119, blue: 119, alpha: 1 };
const Precision = 1;
const BlackToWhiteLightnessDifference = 100;
const MidGrayLightness = 50;

describe('getColorDifference', () => {
    it('reports no difference for identical colors', () => {
        expect(getColorDifference(white, white)).toBe(0);
        expect(getLightnessDifference(black, black)).toBe(0);
    });

    it('spans the full lightness range between black and white', () => {
        expect(getLightnessDifference(black, white)).toBeCloseTo(BlackToWhiteLightnessDifference, Precision);
    });

    it('places mid gray near the middle of the lightness range', () => {
        expect(getLightnessDifference(black, midGray)).toBeCloseTo(MidGrayLightness, 0);
    });

    it('uses the linear segment for very dark colors', () => {
        expect(getLightnessDifference(black, nearBlack)).toBeGreaterThan(0);
    });
});
