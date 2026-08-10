import { describe, expect, it } from '@jest/globals';

import { mixColors } from './mix-colors.util';
import { parseColor } from './parse-color.util';

const HalfProgress = 0.5;
const FullProgress = 1;
const NoProgress = 0;
const HalfBlendedChannelValue = 128;

describe('mixColors', () => {
    it('returns the from color at zero progress', () => {
        expect(parseColor(mixColors('#000000', '#ffffff', NoProgress))).toEqual(parseColor('#000000'));
    });

    it('returns the to color at full progress', () => {
        expect(parseColor(mixColors('#000000', '#ffffff', FullProgress))).toEqual(parseColor('#ffffff'));
    });

    it('blends channels at half progress', () => {
        const color = parseColor(mixColors('#000000', '#ffffff', HalfProgress));

        expect(color?.red).toBe(HalfBlendedChannelValue);
        expect(color?.green).toBe(HalfBlendedChannelValue);
        expect(color?.blue).toBe(HalfBlendedChannelValue);
    });

    it('falls back to opaque black for unparsable colors', () => {
        expect(parseColor(mixColors('not-a-color', '#ffffff', NoProgress))).toEqual(parseColor('#000000'));
    });

    it('falls back to opaque black when the target color cannot be parsed', () => {
        expect(parseColor(mixColors('#ffffff', 'not-a-color', FullProgress))).toEqual(parseColor('#000000'));
    });
});
