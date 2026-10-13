import { describe, expect, it } from 'vitest';

import { mixColors } from '../../../src/theme';

describe('mixColors', () => {
    it('preserves endpoints and rounds blended RGB channels while interpolating alpha', () => {
        expect(mixColors('#000', '#fff', 0)).toBe('rgba(0, 0, 0, 1)');
        expect(mixColors('#000', '#fff', 1)).toBe('rgba(255, 255, 255, 1)');
        expect(mixColors('rgba(0, 20, 40, 0)', 'rgba(255, 100, 200, 1)', 0.5)).toBe('rgba(128, 60, 120, 0.5)');
    });

    it('uses opaque black for invalid endpoints and preserves extrapolation', () => {
        expect(mixColors('invalid', '#fff', 0.5)).toBe('rgba(128, 128, 128, 1)');
        expect(mixColors('#fff', 'invalid', 0.5)).toBe('rgba(128, 128, 128, 1)');
        expect(mixColors('#000', '#fff', 2)).toBe('rgba(510, 510, 510, 1)');
    });
});
