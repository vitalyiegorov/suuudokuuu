import {
    BOX_BY_CELL,
    COLUMN_BY_CELL,
    GRID_BLANK_VALUE,
    GRID_CELL_COUNT,
    GRID_DIGIT_MASK,
    GRID_SIZE,
    ROW_BY_CELL
} from '@suuudokuuu/solver-core';

import { bitForDigit, digitForBit } from '../utils/digit-bit.util';

const NO_CANDIDATES = 0;
const ROW_UNIT_BY_CELL = Uint8Array.from(ROW_BY_CELL);
const COLUMN_UNIT_BY_CELL = Uint8Array.from(COLUMN_BY_CELL, column => GRID_SIZE + column);
const BOX_UNIT_BY_CELL = Uint8Array.from(BOX_BY_CELL, box => GRID_SIZE * 2 + box);

export class BitmaskGridState {
    private assignmentCount = 0;

    private readonly unitMasks = new Uint16Array(GRID_SIZE * 3);
    private readonly cells = new Uint8Array(GRID_CELL_COUNT);
    private readonly assignmentTrail = new Uint8Array(GRID_CELL_COUNT);

    get trailLength(): number {
        return this.assignmentCount;
    }

    reset(): void {
        this.unitMasks.fill(NO_CANDIDATES);
        this.cells.fill(GRID_BLANK_VALUE);
        this.assignmentCount = 0;
    }

    valueAt(cell: number): number {
        return this.cells[cell];
    }

    usedDigitsMaskFor(unitIndex: number): number {
        return this.unitMasks[unitIndex];
    }

    candidatesFor(cell: number): number {
        const row = ROW_UNIT_BY_CELL[cell];
        const column = COLUMN_UNIT_BY_CELL[cell];
        const box = BOX_UNIT_BY_CELL[cell];

        // oxlint-disable-next-line no-bitwise -- combines row/column/box used-digit masks into the cell's remaining candidate mask
        return ~(this.unitMasks[row] | this.unitMasks[column] | this.unitMasks[box]) & GRID_DIGIT_MASK;
    }

    place(cell: number, bit: number): void {
        const row = ROW_UNIT_BY_CELL[cell];
        const column = COLUMN_UNIT_BY_CELL[cell];
        const box = BOX_UNIT_BY_CELL[cell];

        this.cells[cell] = digitForBit(bit);
        /* oxlint-disable no-bitwise -- marks the digit bit as used in its row, column, and box masks */
        this.unitMasks[row] |= bit;
        this.unitMasks[column] |= bit;
        this.unitMasks[box] |= bit;
        /* oxlint-enable no-bitwise */
    }

    remove(cell: number, bit: number): void {
        const row = ROW_UNIT_BY_CELL[cell];
        const column = COLUMN_UNIT_BY_CELL[cell];
        const box = BOX_UNIT_BY_CELL[cell];

        this.cells[cell] = GRID_BLANK_VALUE;
        /* oxlint-disable no-bitwise -- clears the digit bit from its row, column, and box masks */
        this.unitMasks[row] &= ~bit;
        this.unitMasks[column] &= ~bit;
        this.unitMasks[box] &= ~bit;
        /* oxlint-enable no-bitwise */
    }

    assign(cell: number, bit: number): void {
        this.place(cell, bit);
        this.assignmentTrail[this.assignmentCount] = cell;
        this.assignmentCount += 1;
    }

    undoTo(mark: number): void {
        while (this.assignmentCount > mark) {
            this.assignmentCount -= 1;
            const cell = this.assignmentTrail[this.assignmentCount];

            this.remove(cell, bitForDigit(this.valueAt(cell)));
        }
    }

    writeSolutionInto(target: Uint8Array): void {
        target.set(this.cells);
    }
}
