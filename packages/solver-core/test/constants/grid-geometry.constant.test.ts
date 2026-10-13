import { describe, expect, it } from 'vitest';

import { BOX_BY_CELL, COLUMN_BY_CELL, GRID_CELL_COUNT, GRID_SIZE, ROW_BY_CELL } from '../../src/index';

describe('grid geometry', () => {
    it('assigns every cell to its row, column and row-major box', () => {
        expect(ROW_BY_CELL).toHaveLength(GRID_CELL_COUNT);
        expect(COLUMN_BY_CELL).toHaveLength(GRID_CELL_COUNT);
        expect(BOX_BY_CELL).toHaveLength(GRID_CELL_COUNT);

        for (let row = 0; row < GRID_SIZE; row += 1) {
            for (let column = 0; column < GRID_SIZE; column += 1) {
                const cell = row * GRID_SIZE + column;
                expect(ROW_BY_CELL[cell]).toBe(row);
                expect(COLUMN_BY_CELL[cell]).toBe(column);
                expect(BOX_BY_CELL[cell]).toBe(Math.floor(row / 3) * 3 + Math.floor(column / 3));
            }
        }
    });
});
