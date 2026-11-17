import { BOX_BY_CELL, COLUMN_BY_CELL, GRID_BLANK_VALUE, ROW_BY_CELL } from '@suuudokuuu/solver-core';

const cellUnits = [ROW_BY_CELL, COLUMN_BY_CELL, BOX_BY_CELL];

export const getConflictingCellIndexes = (grid: Uint8Array): number[] =>
    Array.from(grid.keys()).filter(
        cellIndex =>
            grid[cellIndex] !== GRID_BLANK_VALUE &&
            grid.some(
                (value, otherIndex) =>
                    otherIndex !== cellIndex &&
                    value === grid[cellIndex] &&
                    cellUnits.some(unitByCell => unitByCell[otherIndex] === unitByCell[cellIndex])
            )
    );
