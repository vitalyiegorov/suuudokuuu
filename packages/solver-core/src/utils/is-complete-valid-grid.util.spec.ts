import { describe, expect, it } from '@jest/globals';

import { GRID_CELL_COUNT } from '../constants/grid.constant';

import { isCompleteValidGrid } from './is-complete-valid-grid.util';
import { parseGridString } from './parse-grid-string.util';

const VALID_GRID = '123456789456789123789123456214365897365897214897214365531642978642978531978531642';

describe('isCompleteValidGrid', () => {
    it('accepts a valid complete grid', () => {
        expect(isCompleteValidGrid(parseGridString(VALID_GRID))).toBe(true);
    });

    it('rejects a grid with a blank', () => {
        const grid = parseGridString(VALID_GRID);
        grid[0] = 0;
        expect(isCompleteValidGrid(grid)).toBe(false);
    });

    it('rejects a duplicate in a row', () => {
        const grid = parseGridString(VALID_GRID);
        const [firstCellValue] = grid;
        grid[1] = firstCellValue;
        expect(isCompleteValidGrid(grid)).toBe(false);
    });

    it('rejects a value of 17', () => {
        const grid = parseGridString(VALID_GRID);
        grid[0] = 17;
        expect(isCompleteValidGrid(grid)).toBe(false);
    });

    it('rejects a value above 9', () => {
        const grid = parseGridString(VALID_GRID);
        grid[0] = 10;
        expect(isCompleteValidGrid(grid)).toBe(false);
    });

    it('rejects an empty grid', () => {
        expect(isCompleteValidGrid(new Uint8Array(0))).toBe(false);
    });

    it('rejects a grid with too many cells', () => {
        expect(isCompleteValidGrid(new Uint8Array(GRID_CELL_COUNT + 1))).toBe(false);
    });
});
