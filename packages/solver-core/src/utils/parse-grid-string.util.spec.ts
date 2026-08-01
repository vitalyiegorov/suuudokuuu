import { describe, expect, it } from '@jest/globals';

import { GRID_CELL_COUNT } from '../constants/grid.constant';

import { parseGridString } from './parse-grid-string.util';

describe('parseGridString', () => {
    it('parses 81 digits into a Uint8Array', () => {
        const grid = parseGridString('123456789'.repeat(9));
        expect(grid).toHaveLength(GRID_CELL_COUNT);
        expect(grid[0]).toBe(1);
        expect(grid[GRID_CELL_COUNT - 1]).toBe(9);
    });

    it('throws on wrong length', () => {
        expect(() => parseGridString('123')).toThrow('81');
    });

    it('throws on non-digit characters', () => {
        expect(() => parseGridString('a'.repeat(GRID_CELL_COUNT))).toThrow('81');
    });
});
