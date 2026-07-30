import { describe, expect, it } from '@jest/globals';

import { parseColor } from './parse-color.util';

const alphaByteValue = 128;
const maxColorChannelValue = 255;

describe('parseColor', () => {
    it('parses 6-digit hex', () => {
        expect(parseColor('#f2f2f2')).toEqual({ red: 242, green: 242, blue: 242, alpha: 1 });
    });

    it('parses 3-digit hex', () => {
        expect(parseColor('#fff')).toEqual({ red: 255, green: 255, blue: 255, alpha: 1 });
    });

    it('parses 8-digit hex with alpha', () => {
        expect(parseColor('#00000080')).toEqual({ red: 0, green: 0, blue: 0, alpha: alphaByteValue / maxColorChannelValue });
    });

    it('parses rgb()', () => {
        expect(parseColor('rgb(255, 255, 255)')).toEqual({ red: 255, green: 255, blue: 255, alpha: 1 });
    });

    it('parses rgba() with fractional alpha', () => {
        expect(parseColor('rgba(0, 0, 0, 0.25)')).toEqual({ red: 0, green: 0, blue: 0, alpha: 0.25 });
    });

    it('parses rgba() without spaces', () => {
        expect(parseColor('rgba(0,0,255,0.28)')).toEqual({ red: 0, green: 0, blue: 255, alpha: 0.28 });
    });

    it('returns null for named colors and garbage', () => {
        expect(parseColor('tomato')).toBeNull();
        expect(parseColor('#12')).toBeNull();
        expect(parseColor('rgba(0,0)')).toBeNull();
        expect(parseColor('')).toBeNull();
    });
});
