import type { CellInterface } from '@suuudokuuu/generator';

const CELL_KEY_ROW_MULTIPLIER = 256;

const getCellMapKey = (cell: CellInterface): number => cell.y * CELL_KEY_ROW_MULTIPLIER + cell.x;

export const getUniqueCells = (cells: CellInterface[]): CellInterface[] => {
    const uniqueCellKeys: number[] = [];
    const uniqueCells: CellInterface[] = [];

    for (const cell of cells) {
        const cellKey = getCellMapKey(cell);
        const existingPosition = uniqueCellKeys.indexOf(cellKey);

        if (existingPosition === -1) {
            uniqueCellKeys.push(cellKey);
            uniqueCells.push(cell);
        } else {
            uniqueCells[existingPosition] = cell;
        }
    }

    return uniqueCells;
};
