/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it } from '@jest/globals';

import { delinearizeSrgbChannel, linearizeSrgbChannel } from './srgb-channel.util';

const Precision = 6;

describe('srgb channel conversion', () => {
    it('linearizes the dark end with the linear segment', () => {
        expect(linearizeSrgbChannel(0)).toBe(0);
        expect(linearizeSrgbChannel(5)).toBeCloseTo(5 / 255 / 12.92, Precision);
    });

    it('linearizes the bright end with the gamma segment', () => {
        expect(linearizeSrgbChannel(255)).toBeCloseTo(1, Precision);
        expect(linearizeSrgbChannel(128)).toBeGreaterThan(0.2);
    });

    it('round-trips every channel value', () => {
        [0, 1, 5, 64, 128, 200, 255].forEach(channel => {
            expect(delinearizeSrgbChannel(linearizeSrgbChannel(channel))).toBeCloseTo(channel, 4);
        });
    });

    it('clamps out-of-gamut linear values', () => {
        expect(delinearizeSrgbChannel(-1)).toBe(0);
        expect(delinearizeSrgbChannel(2)).toBeCloseTo(255, Precision);
    });
});
