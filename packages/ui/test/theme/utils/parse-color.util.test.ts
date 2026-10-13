import { describe, expect, it } from 'vitest';

import { parseColor } from '../../../src/theme/utils/parse-color.util';

describe('parseColor', () => {
    it('parses hex, RGB and alpha channels without depending on native rendering', () => {
        expect(parseColor(' #AbC ')).toEqual({ red: 170, green: 187, blue: 204, alpha: 1 });
        expect(parseColor('#abcdef')).toEqual({ red: 171, green: 205, blue: 239, alpha: 1 });
        expect(parseColor('#abcdef80')).toEqual({ red: 171, green: 205, blue: 239, alpha: 0.5019607843137255 });
        expect(parseColor('rgb(0, 128, 255)')).toEqual({ red: 0, green: 128, blue: 255, alpha: 1 });
        expect(parseColor('rgba(0, 128, 255, .5)')).toEqual({ red: 0, green: 128, blue: 255, alpha: 0.5 });
        expect(parseColor('RGBA(0, 128, 255, 1.0)')).toEqual({ red: 0, green: 128, blue: 255, alpha: 1 });
    });

    it('rejects unsupported syntax and out of range channels', () => {
        for (const color of [
            'red',
            '#abcd',
            '#gggggg',
            'rgb(-1, 0, 0)',
            'rgb(256, 0, 0)',
            'rgb(0, 256, 0)',
            'rgb(0, 0, 256)',
            'rgba(0, 0, 0, 1.1)'
        ]) {
            expect(parseColor(color)).toBeNull();
        }
    });
});
