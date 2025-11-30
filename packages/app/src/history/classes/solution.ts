/* eslint-disable no-bitwise, no-plusplus */
import { isDefined } from '@rnw-community/shared';

import { SolutionStepInterface } from '../interfaces/solution-step.interface';

import type { CellInterface } from '@suuudokuuu/generator';

const GRID_SIZE = 9;
const MAX_TIMESTAMP = 8191;
const BYTES_PER_STEP = 3;
const CELL_INDEX_BITS = 7;
const VALUE_BITS = 4;
const TIMESTAMP_BITS = 13;
const CELL_INDEX_MASK = (1 << CELL_INDEX_BITS) - 1;
const VALUE_MASK = (1 << VALUE_BITS) - 1;
const TIMESTAMP_MASK = (1 << TIMESTAMP_BITS) - 1;
const BYTE_MASK = 0xFF;
const BITS_PER_BYTE = 8;
const VALUE_SHIFT = CELL_INDEX_BITS;
const TIMESTAMP_SHIFT = CELL_INDEX_BITS + VALUE_BITS;

export class Solution {
    private steps: SolutionStepInterface[] = [];
    private totalElapsedTime = 0;

    stringify(): string {
        if (this.steps.length === 0) {
            return '';
        }

        const bytes = new Uint8Array(this.steps.length * BYTES_PER_STEP);

        for (let i = 0; i < this.steps.length; i++) {
            const step = this.steps[i];
            const packed = (step.cellIndex & CELL_INDEX_MASK) |
                           ((step.value & VALUE_MASK) << VALUE_SHIFT) |
                           ((step.ts & TIMESTAMP_MASK) << TIMESTAMP_SHIFT);

            const byteOffset = i * BYTES_PER_STEP;
            bytes[byteOffset] = packed & BYTE_MASK;
            bytes[byteOffset + 1] = (packed >> BITS_PER_BYTE) & BYTE_MASK;
            bytes[byteOffset + 2] = (packed >> (BITS_PER_BYTE * 2)) & BYTE_MASK;
        }

        return this.bytesToBase64(bytes);
    }

    addStep(cell: CellInterface, elapsedTime: number): SolutionStepInterface {
        const timeDiff = elapsedTime - this.totalElapsedTime;
        const cappedTimeDiff = Math.min(timeDiff, MAX_TIMESTAMP);

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

    private parse(solutionSteps: string): SolutionStepInterface[] {
        if (!isDefined(solutionSteps) || solutionSteps.length === 0) {
            return [];
        }

        const bytes = this.base64ToBytes(solutionSteps);
        if (bytes.length % BYTES_PER_STEP !== 0) {
            return [];
        }

        this.steps = [];
        for (let i = 0; i < bytes.length; i += BYTES_PER_STEP) {
            const packed = bytes[i] |
                          (bytes[i + 1] << BITS_PER_BYTE) |
                          (bytes[i + 2] << (BITS_PER_BYTE * 2));

            this.steps.push({
                cellIndex: packed & CELL_INDEX_MASK,
                value: (packed >> VALUE_SHIFT) & VALUE_MASK,
                ts: (packed >> TIMESTAMP_SHIFT) & TIMESTAMP_MASK
            });
        }

        return this.steps;
    }

    private bytesToBase64(bytes: Uint8Array): string {
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }

        return btoa(binary);
    }

    private base64ToBytes(base64: string): Uint8Array {
        try {
            const binary = atob(base64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }

            return bytes;
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
