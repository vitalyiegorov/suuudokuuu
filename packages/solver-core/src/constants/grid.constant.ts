export const GRID_SIZE = 9;
export const GRID_BOX_SIZE = 3;
export const GRID_CELL_COUNT = 81;
export const GRID_BLANK_VALUE = 0;
export const GRID_DIGIT_MASK = 0x1ff;

export const UNIQUENESS_COUNT_LIMIT = 2;
export const ROW_BY_CELL: readonly number[] = Array.from({ length: GRID_CELL_COUNT }, (_, cell) => Math.floor(cell / GRID_SIZE));
export const COLUMN_BY_CELL: readonly number[] = Array.from({ length: GRID_CELL_COUNT }, (_, cell) => cell % GRID_SIZE);
export const BOX_BY_CELL: readonly number[] = ROW_BY_CELL.map(
    (row, cell) => Math.floor(row / GRID_BOX_SIZE) * GRID_BOX_SIZE + Math.floor(COLUMN_BY_CELL[cell] / GRID_BOX_SIZE)
);
