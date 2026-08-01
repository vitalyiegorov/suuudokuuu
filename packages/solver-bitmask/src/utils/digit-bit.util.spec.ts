import { describe, expect, it } from '@jest/globals';
import { GRID_SIZE } from '@suuudokuuu/solver-core';

import { bitForDigit, digitForBit } from './digit-bit.util';

describe('digit-bit conversions', () => {
    it('round-trips every digit from one through nine', () => {
        for (let digit = 1; digit <= GRID_SIZE; digit += 1) {
            expect(digitForBit(bitForDigit(digit))).toBe(digit);
        }
    });

    it('encodes digit one as the lowest bit', () => {
        expect(bitForDigit(1)).toBe(1);
    });

    it('encodes digit nine as the highest bit of the nine-bit mask', () => {
        const highestBitPosition = GRID_SIZE - 1;

        expect(bitForDigit(GRID_SIZE)).toBe(2 ** highestBitPosition);
    });
});
