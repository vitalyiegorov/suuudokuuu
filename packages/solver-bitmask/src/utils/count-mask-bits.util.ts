import { GRID_DIGIT_MASK } from '@suuudokuuu/solver-core';

const MASK_BIT_COUNTS = new Uint8Array(GRID_DIGIT_MASK + 1);

for (let mask = 1; mask <= GRID_DIGIT_MASK; mask += 1) {
    MASK_BIT_COUNTS[mask] = MASK_BIT_COUNTS[Math.floor(mask / 2)] + (mask % 2);
}

export const countMaskBits = (mask: number): number => MASK_BIT_COUNTS[mask];
