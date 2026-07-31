import { GRID_BLANK_VALUE, GRID_CELL_COUNT, GRID_DIGIT_MASK, GRID_SIZE } from '@suuudokuuu/solver-core';

import { BOX_BY_CELL } from '../constants/unit-cells.constant';
import { bitForDigit, digitForBit } from '../utils/digit-bit.util';

const NO_CANDIDATES = 0;

type UnitIndices = readonly [row: number, column: number, box: number];

const unitIndicesFor = (cell: number): UnitIndices => [Math.floor(cell / GRID_SIZE), cell % GRID_SIZE, BOX_BY_CELL[cell]];

export class BitmaskGridState {
    private readonly rowMasks = new Uint16Array(GRID_SIZE);
    private readonly columnMasks = new Uint16Array(GRID_SIZE);
    private readonly boxMasks = new Uint16Array(GRID_SIZE);
    private readonly cells = new Uint8Array(GRID_CELL_COUNT);
    private readonly assignmentTrail = new Uint8Array(GRID_CELL_COUNT);
    private readonly unitMasksByType = [this.rowMasks, this.columnMasks, this.boxMasks];
    private trailLengthValue = 0;

    get trailLength(): number {
        return this.trailLengthValue;
    }

    reset(): void {
        this.rowMasks.fill(NO_CANDIDATES);
        this.columnMasks.fill(NO_CANDIDATES);
        this.boxMasks.fill(NO_CANDIDATES);
        this.cells.fill(GRID_BLANK_VALUE);
        this.trailLengthValue = 0;
    }

    valueAt(cell: number): number {
        return this.cells[cell];
    }

    usedDigitsMaskFor(unitType: number, unitIndex: number): number {
        return this.unitMasksByType[unitType][unitIndex];
    }

    candidatesFor(cell: number): number {
        const [row, column, box] = unitIndicesFor(cell);

        // eslint-disable-next-line no-bitwise -- combines row/column/box used-digit masks into the cell's remaining candidate mask
        return ~(this.rowMasks[row] | this.columnMasks[column] | this.boxMasks[box]) & GRID_DIGIT_MASK;
    }

    place(cell: number, bit: number): void {
        const [row, column, box] = unitIndicesFor(cell);

        this.cells[cell] = digitForBit(bit);
        /* eslint-disable no-bitwise -- marks the digit bit as used in its row, column, and box masks */
        this.rowMasks[row] |= bit;
        this.columnMasks[column] |= bit;
        this.boxMasks[box] |= bit;
        /* eslint-enable no-bitwise */
    }

    remove(cell: number, bit: number): void {
        const [row, column, box] = unitIndicesFor(cell);

        this.cells[cell] = GRID_BLANK_VALUE;
        /* eslint-disable no-bitwise -- clears the digit bit from its row, column, and box masks */
        this.rowMasks[row] &= ~bit;
        this.columnMasks[column] &= ~bit;
        this.boxMasks[box] &= ~bit;
        /* eslint-enable no-bitwise */
    }

    assign(cell: number, bit: number): void {
        this.place(cell, bit);
        this.assignmentTrail[this.trailLengthValue] = cell;
        this.trailLengthValue += 1;
    }

    undoTo(mark: number): void {
        while (this.trailLengthValue > mark) {
            this.trailLengthValue -= 1;
            const cell = this.assignmentTrail[this.trailLengthValue];

            this.remove(cell, bitForDigit(this.valueAt(cell)));
        }
    }

    writeSolutionInto(target: Uint8Array): void {
        target.set(this.cells);
    }
}
