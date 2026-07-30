import { GRID_BLANK_VALUE, GRID_BOX_SIZE, GRID_CELL_COUNT, GRID_SIZE } from '../constants/grid.constant';

/* eslint-disable no-bitwise -- row/column/box duplicate checks use bitmask set operations for constant-time membership tests */
export const isCompleteValidGrid = (grid: Uint8Array): boolean => {
    if (grid.length !== GRID_CELL_COUNT) {
        return false;
    }

    const rowMasks = new Uint16Array(GRID_SIZE);
    const columnMasks = new Uint16Array(GRID_SIZE);
    const boxMasks = new Uint16Array(GRID_SIZE);

    for (let cell = 0; cell < GRID_CELL_COUNT; cell += 1) {
        const value = grid[cell];
        if (value === GRID_BLANK_VALUE) {
            return false;
        }

        const row = Math.floor(cell / GRID_SIZE);
        const column = cell % GRID_SIZE;
        const box = Math.floor(row / GRID_BOX_SIZE) * GRID_BOX_SIZE + Math.floor(column / GRID_BOX_SIZE);
        const bit = 1 << (value - 1);

        const hasDuplicate = (rowMasks[row] & bit) !== 0 || (columnMasks[column] & bit) !== 0 || (boxMasks[box] & bit) !== 0;
        if (hasDuplicate) {
            return false;
        }

        rowMasks[row] |= bit;
        columnMasks[column] |= bit;
        boxMasks[box] |= bit;
    }

    return true;
};
/* eslint-enable no-bitwise */
