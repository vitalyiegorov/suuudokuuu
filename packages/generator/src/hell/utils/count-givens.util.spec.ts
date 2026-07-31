import { describe, expect, it } from '@jest/globals';
import { GRID_CELL_COUNT, parseGridString } from '@suuudokuuu/solver-core';

import { countGivens } from './count-givens.util';

const ROYLE_17 = '000000010400000000020000000000050407008000300001090000300400200050100000000806000';
const ROYLE_17_GIVENS_COUNT = 17;

describe('countGivens', () => {
    it('returns zero for an empty grid', () => {
        const grid = new Uint8Array(GRID_CELL_COUNT);

        expect(countGivens(grid)).toBe(0);
    });

    it('returns the full cell count for a completely filled grid', () => {
        const grid = new Uint8Array(GRID_CELL_COUNT).fill(5);

        expect(countGivens(grid)).toBe(GRID_CELL_COUNT);
    });

    it('returns the exact number of non-blank cells for a mixed grid', () => {
        const grid = parseGridString(ROYLE_17);

        expect(countGivens(grid)).toBe(ROYLE_17_GIVENS_COUNT);
    });
});
