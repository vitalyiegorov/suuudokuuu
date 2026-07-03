import { BitInputStream, BitOutputStream } from '@thi.ng/bitstream';

import { isNotEmptyString } from '@rnw-community/shared';

import { CELL_INDEX_BITS, TECHNIQUE_BITS, TIMESTAMP_BITS, VALUE_BITS } from '../../constants/bit-encoding.constant';
import { GRID_SIZE } from '../../constants/grid.constant';
import {
    SOLUTION_FORMAT_VERSION_CELL_INDEX,
    SOLUTION_FORMAT_VERSION_TECHNIQUE,
    SOLUTION_FORMAT_VERSION_TIMESTAMP,
    SOLUTION_FORMAT_VERSION_VALUE,
    SOLUTION_GUESS_TECHNIQUE
} from '../../constants/solution-format.constant';
import { isValidCellIndex } from '../../util/is-valid-cell-index.util';
import { isValidCellValue } from '../../util/is-valid-cell-value.util';
import { isValidTechnique } from '../../util/is-valid-technique.util';
import { stringToUint8Array } from '../../util/string-to-uint8array.util';

import type { CellPositionInterface } from '../../interfaces/cell-position.interface';
import type { SolutionStepInterface } from '../../interfaces/solution-step.interface';

export class Solution {
    private readonly maxTimestamp = 2 ** TIMESTAMP_BITS - 1;
    private readonly bitsPerStep = CELL_INDEX_BITS + VALUE_BITS + TIMESTAMP_BITS + TECHNIQUE_BITS;
    private readonly legacyBitsPerStep = CELL_INDEX_BITS + VALUE_BITS + TIMESTAMP_BITS;

    private steps: SolutionStepInterface[] = [];

    stringify(): string {
        if (this.steps.length === 0) {
            return '';
        }

        const out = new BitOutputStream();

        this.writeVersion(out);

        for (const step of this.steps) {
            out.write(step.cellIndex, CELL_INDEX_BITS);
            out.write(step.value, VALUE_BITS);
            out.write(step.ts, TIMESTAMP_BITS);
            out.write(step.technique, TECHNIQUE_BITS);
        }

        return String.fromCharCode(...out.bytes());
    }

    addStep(
        cell: CellPositionInterface,
        elapsedTime: number,
        technique: number = SOLUTION_GUESS_TECHNIQUE,
        isGuessLike = technique === SOLUTION_GUESS_TECHNIQUE
    ): SolutionStepInterface {
        const totalElapsedTime = this.steps.reduce((total, step) => total + step.ts, 0);
        const timeDiff = elapsedTime - totalElapsedTime;
        const cappedTimeDiff = Math.min(timeDiff, this.maxTimestamp);

        const lastStep = {
            cellIndex: cell.y * GRID_SIZE + cell.x,
            value: cell.value,
            ts: cappedTimeDiff,
            technique,
            isGuessLike
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
            this.steps = this.hasVersion(inputString) ? this.parseVersioned(inputString) : this.parseLegacy(inputString);
        } catch {
            return this.steps;
        }

        return this.steps;
    }

    private parseVersioned(inputString: string): SolutionStepInterface[] {
        const input = new BitInputStream(stringToUint8Array(inputString));
        const steps: SolutionStepInterface[] = [];

        this.readVersion(input);

        while (input.position + this.bitsPerStep <= input.length) {
            const cellIndex = input.read(CELL_INDEX_BITS);
            const value = input.read(VALUE_BITS);
            const ts = input.read(TIMESTAMP_BITS);
            const technique = input.read(TECHNIQUE_BITS);

            if (this.isValidStep(cellIndex, value, ts) && isValidTechnique(technique)) {
                steps.push({ cellIndex, value, ts, technique, isGuessLike: technique === SOLUTION_GUESS_TECHNIQUE });
            }
        }

        return steps;
    }

    private parseLegacy(inputString: string): SolutionStepInterface[] {
        const input = new BitInputStream(stringToUint8Array(inputString));
        const steps: SolutionStepInterface[] = [];

        while (input.position + this.legacyBitsPerStep <= input.length) {
            const cellIndex = input.read(CELL_INDEX_BITS);
            const value = input.read(VALUE_BITS);
            const ts = input.read(TIMESTAMP_BITS);

            if (this.isValidStep(cellIndex, value, ts)) {
                steps.push({ cellIndex, value, ts, technique: SOLUTION_GUESS_TECHNIQUE, isGuessLike: true });
            }
        }

        return steps;
    }

    private hasVersion(inputString: string): boolean {
        const input = new BitInputStream(stringToUint8Array(inputString));

        if (input.length < this.bitsPerStep) {
            return false;
        }

        const cellIndex = input.read(CELL_INDEX_BITS);
        const value = input.read(VALUE_BITS);
        const ts = input.read(TIMESTAMP_BITS);
        const technique = input.read(TECHNIQUE_BITS);

        return (
            cellIndex === SOLUTION_FORMAT_VERSION_CELL_INDEX &&
            value === SOLUTION_FORMAT_VERSION_VALUE &&
            ts === SOLUTION_FORMAT_VERSION_TIMESTAMP &&
            technique === SOLUTION_FORMAT_VERSION_TECHNIQUE
        );
    }

    private isValidStep(cellIndex: number, value: number, ts: number): boolean {
        return isValidCellValue(value) && isValidCellIndex(cellIndex) && ts >= 0 && ts <= this.maxTimestamp;
    }

    private readVersion(input: BitInputStream): void {
        input.read(CELL_INDEX_BITS);
        input.read(VALUE_BITS);
        input.read(TIMESTAMP_BITS);
        input.read(TECHNIQUE_BITS);
    }

    private writeVersion(out: BitOutputStream): void {
        out.write(SOLUTION_FORMAT_VERSION_CELL_INDEX, CELL_INDEX_BITS);
        out.write(SOLUTION_FORMAT_VERSION_VALUE, VALUE_BITS);
        out.write(SOLUTION_FORMAT_VERSION_TIMESTAMP, TIMESTAMP_BITS);
        out.write(SOLUTION_FORMAT_VERSION_TECHNIQUE, TECHNIQUE_BITS);
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
