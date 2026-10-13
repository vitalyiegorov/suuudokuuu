import { GRID_BOX_SIZE, GRID_CELL_COUNT, GRID_SIZE } from '@suuudokuuu/solver-core';
import { describe, expect, it } from 'vitest';

import { ALL_UNIT_CELLS } from '../../src/constants/unit-cells.constant';

describe('unit-cells constant', () => {
    it('lists all 27 row, column, and box units in that order', () => {
        expect(ALL_UNIT_CELLS).toHaveLength(GRID_SIZE * 3);

        for (let unit = 0; unit < ALL_UNIT_CELLS.length; unit += 1) {
            const cells = ALL_UNIT_CELLS[unit];
            const unitIndex = unit % GRID_SIZE;
            const unitType = Math.floor(unit / GRID_SIZE);

            expect(cells).toHaveLength(GRID_SIZE);
            expect(new Set(cells).size).toBe(GRID_SIZE);
            expect(Array.from(cells)).toEqual(
                Array.from({ length: GRID_CELL_COUNT }, (_, cell) => cell).filter(cell => {
                    const row = Math.floor(cell / GRID_SIZE);
                    const column = cell % GRID_SIZE;
                    const indices = [row, column, Math.floor(row / GRID_BOX_SIZE) * GRID_BOX_SIZE + Math.floor(column / GRID_BOX_SIZE)];

                    return indices[unitType] === unitIndex;
                })
            );
        }
    });
});
