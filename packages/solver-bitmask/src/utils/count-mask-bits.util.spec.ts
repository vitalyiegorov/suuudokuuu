import { describe, expect, it } from '@jest/globals';
import { GRID_DIGIT_MASK, GRID_SIZE } from '@suuudokuuu/solver-core';

import { countMaskBits } from './count-mask-bits.util';

describe('countMaskBits', () => {
    it('returns zero for an empty mask', () => {
        expect(countMaskBits(0)).toBe(0);
    });

    it('returns nine for a full nine-bit mask', () => {
        expect(countMaskBits(GRID_DIGIT_MASK)).toBe(GRID_SIZE);
    });

    it('returns the number of set bits for a sparse mask', () => {
        expect(countMaskBits(0b101)).toBe(2);
    });
});
