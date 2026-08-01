import { describe, expect, it } from '@jest/globals';
import { GRID_CELL_COUNT, GRID_SIZE } from '@suuudokuuu/solver-core';

import {
    ALL_UNIT_CELLS,
    BOX_BY_CELL,
    BOX_CELLS,
    BOX_UNIT_TYPE,
    COLUMN_BY_CELL,
    COLUMN_CELLS,
    COLUMN_UNIT_TYPE,
    ROW_BY_CELL,
    ROW_CELLS,
    ROW_UNIT_TYPE
} from './unit-cells.constant';

const sortedNumbers = (values: Uint8Array): number[] => Array.from(values).sort((left, right) => left - right);

describe('unit-cells constant', () => {
    it('groups every cell into nine row units of nine unique cells each', () => {
        for (const rowCells of ROW_CELLS) {
            expect(rowCells.length).toBe(GRID_SIZE);
            expect(new Set(rowCells).size).toBe(GRID_SIZE);
        }
    });

    it('groups every cell into nine column units of nine unique cells each', () => {
        for (const columnCells of COLUMN_CELLS) {
            expect(columnCells.length).toBe(GRID_SIZE);
            expect(new Set(columnCells).size).toBe(GRID_SIZE);
        }
    });

    it('groups every cell into nine box units of nine unique cells each', () => {
        for (const boxCells of BOX_CELLS) {
            expect(boxCells.length).toBe(GRID_SIZE);
            expect(new Set(boxCells).size).toBe(GRID_SIZE);
        }
    });

    it('assigns every cell index exactly once across row units', () => {
        const allRowCells = ROW_CELLS.flatMap(rowCells => Array.from(rowCells));

        expect(sortedNumbers(Uint8Array.from(allRowCells))).toEqual(Array.from({ length: GRID_CELL_COUNT }, (_, cell) => cell));
    });

    it('maps the corners of the grid to the expected box indices', () => {
        expect(BOX_BY_CELL[0]).toBe(0);
        expect(BOX_BY_CELL[GRID_CELL_COUNT - 1]).toBe(GRID_SIZE - 1);
    });

    it('places box-mates within the same box unit', () => {
        const topLeftCell = 0;
        const boxOfTopLeftCell = BOX_BY_CELL[topLeftCell];

        expect(Array.from(BOX_CELLS[boxOfTopLeftCell])).toContain(topLeftCell);
    });

    it('exposes row, column, and box units in a fixed order', () => {
        expect(ALL_UNIT_CELLS).toEqual([ROW_CELLS, COLUMN_CELLS, BOX_CELLS]);
    });

    it('pins each unit type constant to its matching index in ALL_UNIT_CELLS', () => {
        expect(ROW_UNIT_TYPE).toBe(0);
        expect(COLUMN_UNIT_TYPE).toBe(1);
        expect(BOX_UNIT_TYPE).toBe(2);
        expect(ALL_UNIT_CELLS[ROW_UNIT_TYPE]).toBe(ROW_CELLS);
        expect(ALL_UNIT_CELLS[COLUMN_UNIT_TYPE]).toBe(COLUMN_CELLS);
        expect(ALL_UNIT_CELLS[BOX_UNIT_TYPE]).toBe(BOX_CELLS);
    });

    it('agrees with ROW_CELLS on the row index of every cell', () => {
        for (let row = 0; row < GRID_SIZE; row += 1) {
            for (const cell of ROW_CELLS[row]) {
                expect(ROW_BY_CELL[cell]).toBe(row);
            }
        }
    });

    it('agrees with COLUMN_CELLS on the column index of every cell', () => {
        for (let column = 0; column < GRID_SIZE; column += 1) {
            for (const cell of COLUMN_CELLS[column]) {
                expect(COLUMN_BY_CELL[cell]).toBe(column);
            }
        }
    });

    it('maps the corners of the grid to the expected row and column indices', () => {
        expect(ROW_BY_CELL[0]).toBe(0);
        expect(COLUMN_BY_CELL[0]).toBe(0);
        expect(ROW_BY_CELL[GRID_CELL_COUNT - 1]).toBe(GRID_SIZE - 1);
        expect(COLUMN_BY_CELL[GRID_CELL_COUNT - 1]).toBe(GRID_SIZE - 1);
    });
});
