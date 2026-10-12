import { BOX_BY_CELL, COLUMN_BY_CELL, GRID_BOX_SIZE, GRID_CELL_COUNT, GRID_SIZE, ROW_BY_CELL } from '@suuudokuuu/solver-core';

const createAllUnitCells = (): Uint8Array[] => {
    const units = Array.from({ length: GRID_SIZE * 3 }, () => new Uint8Array(GRID_SIZE));

    for (let cell = 0; cell < GRID_CELL_COUNT; cell += 1) {
        const row = ROW_BY_CELL[cell];
        const column = COLUMN_BY_CELL[cell];
        const box = BOX_BY_CELL[cell];

        units[row][column] = cell;
        units[GRID_SIZE + column][row] = cell;
        units[GRID_SIZE * 2 + box][(row % GRID_BOX_SIZE) * GRID_BOX_SIZE + (column % GRID_BOX_SIZE)] = cell;
    }

    return units;
};

export const ALL_UNIT_CELLS = createAllUnitCells();
