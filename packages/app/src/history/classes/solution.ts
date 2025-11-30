import { BitInputStream, BitOutputStream } from '@thi.ng/bitstream';

import { isNotEmptyString } from '@rnw-community/shared';

import { CELL_INDEX_BITS, TIMESTAMP_BITS, VALUE_BITS } from '../constants/bit-encoding.constant';
import { GRID_SIZE } from '../constants/grid.constant';
import { SolutionStepInterface } from '../interfaces/solution-step.interface';
import { isValidCellIndex } from '../util/is-valid-cell-index.util';
import { isValidCellValue } from '../util/is-valid-cell-value.util';
import { stringToUint8Array } from '../util/string-to-uint8array.util';

import type { CellInterface } from '@suuudokuuu/generator';

const BITS_PER_STEP = CELL_INDEX_BITS + VALUE_BITS + TIMESTAMP_BITS;

export class Solution {
    private readonly maxTimestamp = 8191;

    private steps: SolutionStepInterface[] = [];
    private totalElapsedTime = 0;

    stringify(): string {
        if (this.steps.length === 0) {
            return '';
        }

        const out = new BitOutputStream();
        for (const step of this.steps) {
            out.write(step.cellIndex, CELL_INDEX_BITS);
            out.write(step.value, VALUE_BITS);
            out.write(step.ts, TIMESTAMP_BITS);
        }

        return String.fromCharCode(...out.bytes());
    }

    addStep(cell: Pick<CellInterface, 'x' | 'y' | 'value'>, elapsedTime: number): SolutionStepInterface {
        const timeDiff = elapsedTime - this.totalElapsedTime;
        const cappedTimeDiff = Math.min(timeDiff, this.maxTimestamp);

        const lastStep = {
            cellIndex: cell.y * GRID_SIZE + cell.x,
            value: cell.value,
            ts: cappedTimeDiff
        };

        this.steps.push(lastStep);
        this.totalElapsedTime = elapsedTime;

        return lastStep;
    }

    getSteps(): SolutionStepInterface[] {
        return this.steps;
    }

    private parse(inputBase64: string): SolutionStepInterface[] {
        if (!isNotEmptyString(inputBase64)) {
            return [];
        }

        const input = new BitInputStream(stringToUint8Array(inputBase64));

        while (input.position + BITS_PER_STEP <= input.length) {
            const index = input.read(CELL_INDEX_BITS);
            const value = input.read(VALUE_BITS);
            const ts = input.read(TIMESTAMP_BITS);

            if (isValidCellValue(value) && isValidCellIndex(index) && ts >= 0 && ts <= this.maxTimestamp) {
                this.steps.push({ cellIndex: index, value, ts });
            }
        }

        return this.steps;
    }

    static fromString(solutionSteps: string): Solution {
        const solution = new Solution();

        solution.parse(solutionSteps);

        return solution;
    }

    static fromSteps(steps: SolutionStepInterface[]): Solution {
        const solution = new Solution();

        solution.steps = steps;

        return solution;
    }
}
