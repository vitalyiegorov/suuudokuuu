import { BitInputStream, BitOutputStream } from '@thi.ng/bitstream';

import { isNotEmptyString } from '@rnw-community/shared';

import { CELL_INDEX_BITS, TIMESTAMP_BITS, VALUE_BITS } from '../../constants/bit-encoding.constant';
import { GRID_SIZE } from '../../constants/grid.constant';
import { CellPositionInterface } from '../../interfaces/cell-position.interface';
import { SolutionStepInterface } from '../../interfaces/solution-step.interface';
import { base64ToUint8Array } from '../../util/base64-to-uint8array.util';
import { isValidCellIndex } from '../../util/is-valid-cell-index.util';
import { isValidCellValue } from '../../util/is-valid-cell-value.util';

export class Solution {
    private readonly maxTimestamp = 2 ** TIMESTAMP_BITS - 1;
    private readonly bitsPerStep = CELL_INDEX_BITS + VALUE_BITS + TIMESTAMP_BITS;

    private steps: SolutionStepInterface[] = [];

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

        return btoa(String.fromCharCode(...out.bytes()));
    }

    addStep(cell: CellPositionInterface, elapsedTime: number): SolutionStepInterface {
        const totalElapsedTime = this.steps.reduce((total, step) => total + step.ts, 0);
        const timeDiff = elapsedTime - totalElapsedTime;
        const cappedTimeDiff = Math.min(timeDiff, this.maxTimestamp);

        const lastStep = {
            cellIndex: cell.y * GRID_SIZE + cell.x,
            value: cell.value,
            ts: cappedTimeDiff
        };

        this.steps.push(lastStep);

        return lastStep;
    }

    getSteps(): SolutionStepInterface[] {
        return this.steps;
    }

    getElapsedTime(): number {
        return this.steps.reduce((total, step) => total + step.ts, 0);
    }

    private parse(inputString: string): SolutionStepInterface[] {
        if (!isNotEmptyString(inputString)) {
            return [];
        }

        this.steps = [];

        try {
            const input = new BitInputStream(base64ToUint8Array(inputString));

            while (input.position + this.bitsPerStep <= input.length) {
                const index = input.read(CELL_INDEX_BITS);
                const value = input.read(VALUE_BITS);
                const ts = input.read(TIMESTAMP_BITS);

                if (isValidCellValue(value) && isValidCellIndex(index) && ts >= 0 && ts <= this.maxTimestamp) {
                    this.steps.push({ cellIndex: index, value, ts });
                }
            }
        } catch {
            return this.steps;
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
