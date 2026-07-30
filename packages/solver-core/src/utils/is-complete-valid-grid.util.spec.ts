import { describe, expect, it } from '@jest/globals';

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
});
