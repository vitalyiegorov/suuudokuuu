import { BitInputStream, BitOutputStream } from '@thi.ng/bitstream';

import { isNotEmptyString } from '@rnw-community/shared';

import { CELL_INDEX_BITS, TIMESTAMP_BITS, VALUE_BITS } from '../constants/bit-encoding.constant';
import { SolutionStepInterface } from '../interfaces/solution-step.interface';
import { stringToUint8Array } from '../util/string-to-uint8array.util';

import type { CellInterface } from '@suuudokuuu/generator';

export class Solution {
    private readonly gridSize = 9;
    private readonly totalCells = this.gridSize * this.gridSize;
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
            cellIndex: cell.y * this.gridSize + cell.x,
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

    // eslint-disable-next-line max-statements
    private parse(inputBase64: string): SolutionStepInterface[] {
        if (!isNotEmptyString(inputBase64)) {
            return [];
        }

        try {
            const input = new BitInputStream(stringToUint8Array(inputBase64));

            do {
                const cellIndex = input.read(CELL_INDEX_BITS);
                const value = input.read(VALUE_BITS);
                const ts = input.read(TIMESTAMP_BITS);

                if (cellIndex > this.totalCells - 1 || cellIndex < 0) {
                    // eslint-disable-next-line no-continue
                    continue;
                }

                if (value > this.gridSize || value <= 0) {
                    // eslint-disable-next-line no-continue
                    continue;
                }

                if (ts > this.maxTimestamp || ts < 0) {
                    // eslint-disable-next-line no-continue
                    continue;
                }

                this.steps.push({ cellIndex, value, ts });
            } while (input.length > 0);
        } catch {
            return [];
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
