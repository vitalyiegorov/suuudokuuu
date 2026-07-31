import { GRID_CELL_COUNT, GRID_SIZE } from '@suuudokuuu/solver-core';

import type { FieldInterface } from '../interfaces/field.interface';

export const fieldToGrid = (field: FieldInterface): Uint8Array => {
    const grid = new Uint8Array(GRID_CELL_COUNT);

    for (let y = 0; y < GRID_SIZE; y += 1) {
        for (let x = 0; x < GRID_SIZE; x += 1) {
            grid[y * GRID_SIZE + x] = field[y][x].value;
        }
    }

    return grid;
};
