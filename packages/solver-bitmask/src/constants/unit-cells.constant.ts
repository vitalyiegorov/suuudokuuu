import { GRID_BOX_SIZE, GRID_CELL_COUNT, GRID_SIZE } from '@suuudokuuu/solver-core';

const boxIndexForCell = (cell: number): number => {
    const row = Math.floor(cell / GRID_SIZE);
    const column = cell % GRID_SIZE;

    return Math.floor(row / GRID_BOX_SIZE) * GRID_BOX_SIZE + Math.floor(column / GRID_BOX_SIZE);
};

const createBoxByCell = (): Uint8Array => {
    const boxByCell = new Uint8Array(GRID_CELL_COUNT);

    for (let cell = 0; cell < GRID_CELL_COUNT; cell += 1) {
        boxByCell[cell] = boxIndexForCell(cell);
    }

    return boxByCell;
};

const createRowByCell = (): Uint8Array => {
    const rowByCell = new Uint8Array(GRID_CELL_COUNT);

    for (let cell = 0; cell < GRID_CELL_COUNT; cell += 1) {
        rowByCell[cell] = Math.floor(cell / GRID_SIZE);
    }

    return rowByCell;
};

const createColumnByCell = (): Uint8Array => {
    const columnByCell = new Uint8Array(GRID_CELL_COUNT);

    for (let cell = 0; cell < GRID_CELL_COUNT; cell += 1) {
        columnByCell[cell] = cell % GRID_SIZE;
    }

    return columnByCell;
};

const createRowCells = (): Uint8Array[] => {
    const rowCells: Uint8Array[] = [];

    for (let row = 0; row < GRID_SIZE; row += 1) {
        const cellsInRow = new Uint8Array(GRID_SIZE);

        for (let column = 0; column < GRID_SIZE; column += 1) {
            cellsInRow[column] = row * GRID_SIZE + column;
        }

        rowCells.push(cellsInRow);
    }

    return rowCells;
};

const createColumnCells = (): Uint8Array[] => {
    const columnCells: Uint8Array[] = [];

    for (let column = 0; column < GRID_SIZE; column += 1) {
        const cellsInColumn = new Uint8Array(GRID_SIZE);

        for (let row = 0; row < GRID_SIZE; row += 1) {
            cellsInColumn[row] = row * GRID_SIZE + column;
        }

        columnCells.push(cellsInColumn);
    }

    return columnCells;
};

const createBoxCells = (boxByCell: Uint8Array): Uint8Array[] => {
    const boxCells: Uint8Array[] = [];

    for (let box = 0; box < GRID_SIZE; box += 1) {
        boxCells.push(new Uint8Array(GRID_SIZE));
    }

    const nextFreePositionByBox = new Uint8Array(GRID_SIZE);

    for (let cell = 0; cell < GRID_CELL_COUNT; cell += 1) {
        const box = boxByCell[cell];
        const position = nextFreePositionByBox[box];

        boxCells[box][position] = cell;
        nextFreePositionByBox[box] += 1;
    }

    return boxCells;
};

export const BOX_BY_CELL = createBoxByCell();
export const ROW_BY_CELL = createRowByCell();
export const COLUMN_BY_CELL = createColumnByCell();
export const ROW_CELLS = createRowCells();
export const COLUMN_CELLS = createColumnCells();
export const BOX_CELLS = createBoxCells(BOX_BY_CELL);
export const ALL_UNIT_CELLS = [ROW_CELLS, COLUMN_CELLS, BOX_CELLS] as const;
