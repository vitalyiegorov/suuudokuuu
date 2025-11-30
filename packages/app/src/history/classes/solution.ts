/* eslint-disable no-bitwise, @typescript-eslint/no-magic-numbers */
import { isDefined } from '@rnw-community/shared';

import { SolutionStepInterface } from '../interfaces/solution-step.interface';

import type { CellInterface } from '@suuudokuuu/generator';

export class Solution {
    private readonly gridSize = 9;
    private readonly maxTimestamp = 8191;
    private readonly bytesPerStep = 3;
    private readonly cellIndexBits = 7;
    private readonly valueBits = 4;
    private readonly timestampBits = 13;
    private readonly cellIndexMask = (1 << this.cellIndexBits) - 1;
    private readonly valueMask = (1 << this.valueBits) - 1;
    private readonly timestampMask = (1 << this.timestampBits) - 1;
    private readonly byteMask = 0xFF;
    private readonly bitsPerByte = 8;
    private readonly valueShift = this.cellIndexBits;
    private readonly timestampShift = this.cellIndexBits + this.valueBits;

    private steps: SolutionStepInterface[] = [];
    private totalElapsedTime = 0;

    stringify(): string {
        if (this.steps.length === 0) {
            return '';
        }

        const bytes = new Uint8Array(this.steps.length * this.bytesPerStep);

        for (let i = 0; i < this.steps.length; i += 1) {
            const step = this.steps[i];
            const packed = (step.cellIndex & this.cellIndexMask) |
                           ((step.value & this.valueMask) << this.valueShift) |
                           ((step.ts & this.timestampMask) << this.timestampShift);

            const byteOffset = i * this.bytesPerStep;
            bytes[byteOffset] = packed & this.byteMask;
            bytes[byteOffset + 1] = (packed >> this.bitsPerByte) & this.byteMask;
            bytes[byteOffset + 2] = (packed >> (this.bitsPerByte * 2)) & this.byteMask;
        }

        return this.bytesToBase64(bytes);
    }

    addStep(cell: CellInterface, elapsedTime: number): SolutionStepInterface {
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

    private parse(solutionSteps: string): SolutionStepInterface[] {
        if (!isDefined(solutionSteps) || solutionSteps.length === 0) {
            return [];
        }

        const bytes = this.base64ToBytes(solutionSteps);
        if (bytes.length % this.bytesPerStep !== 0) {
            return [];
        }

        this.steps = [];
        for (let i = 0; i < bytes.length; i += this.bytesPerStep) {
            const packed = bytes[i] |
                          (bytes[i + 1] << this.bitsPerByte) |
                          (bytes[i + 2] << (this.bitsPerByte * 2));

            this.steps.push({
                cellIndex: packed & this.cellIndexMask,
                value: (packed >> this.valueShift) & this.valueMask,
                ts: (packed >> this.timestampShift) & this.timestampMask
            });
        }

        return this.steps;
    }

    private bytesToBase64(bytes: Uint8Array): string {
        return btoa(String.fromCharCode(...bytes));
    }

    private base64ToBytes(base64: string): Uint8Array {
        try {
            const binary = atob(base64);

            return Uint8Array.from(binary, char => char.charCodeAt(0));
        } catch {
            return new Uint8Array(0);
        }
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
