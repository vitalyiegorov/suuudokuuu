import { GRID_BLANK_VALUE, GRID_CELL_COUNT, GRID_SIZE } from '@suuudokuuu/solver-core';

import type { FieldInterface } from '../interfaces/field.interface';

export const fieldToGrid = (field: FieldInterface, blankCellValue = GRID_BLANK_VALUE): Uint8Array => {
    const grid = new Uint8Array(GRID_CELL_COUNT);

    for (let y = 0; y < GRID_SIZE; y += 1) {
        for (let x = 0; x < GRID_SIZE; x += 1) {
            const { value } = field[y][x];
            grid[y * GRID_SIZE + x] = value === blankCellValue ? GRID_BLANK_VALUE : value;
        }
    }

    return grid;
};
