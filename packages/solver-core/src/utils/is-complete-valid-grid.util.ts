import { BOX_BY_CELL, COLUMN_BY_CELL, GRID_BLANK_VALUE, GRID_CELL_COUNT, GRID_SIZE, ROW_BY_CELL } from '../constants/grid.constant';

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

        const isOutOfDigitRange = value < 1 || value > GRID_SIZE;
        if (isOutOfDigitRange) {
            return false;
        }

        const row = ROW_BY_CELL[cell];
        const column = COLUMN_BY_CELL[cell];
        const box = BOX_BY_CELL[cell];

        /* oxlint-disable no-bitwise -- row/column/box duplicate checks use bitmask set operations for constant-time membership tests */
        const bit = 1 << (value - 1);

        const hasDuplicate = (rowMasks[row] & bit) !== 0 || (columnMasks[column] & bit) !== 0 || (boxMasks[box] & bit) !== 0;
        if (hasDuplicate) {
            return false;
        }

        rowMasks[row] |= bit;
        columnMasks[column] |= bit;
        boxMasks[box] |= bit;
        /* oxlint-enable no-bitwise */
    }

    return true;
};
