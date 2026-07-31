import { GRID_BLANK_VALUE } from '@suuudokuuu/solver-core';

export const countGivens = (grid: Uint8Array): number => {
    let total = 0;

    for (const value of grid) {
        if (value !== GRID_BLANK_VALUE) {
            total += 1;
        }
    }

    return total;
};
