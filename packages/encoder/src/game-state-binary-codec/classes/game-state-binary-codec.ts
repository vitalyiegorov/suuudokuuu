import { BitInputStream, BitOutputStream } from '@thi.ng/bitstream';

import {
    CODEC_PREFIX,
    CODEC_RESERVED_BITS,
    CODEC_VERSION,
    CODEC_VERSION_BITS,
    MAX_MISTAKES_BITS,
    MAX_MISTAKES_LIMIT,
    STEP_COUNT_BITS
} from '../../@generic/constants/binary-codec.constant';
import { TIMESTAMP_BITS } from '../../@generic/constants/bit-encoding.constant';
import { GRID_CELL_COUNT, GRID_EMPTY_CELL } from '../../@generic/constants/grid.constant';
import { base64urlToBytes } from '../../@generic/utils/base64url-to-bytes.util';
import { bytesToBase64url } from '../../@generic/utils/bytes-to-base64url.util';
import {
    collectEmptyCells,
    getPositionBits,
    readGivens,
    readPackedValues,
    writeGivens,
    writePackedValues
} from '../../@generic/utils/givens-codec.util';

import type { SolutionStepInterface } from '../../@generic/interfaces/solution-step.interface';

export class GameStateBinaryCodec {
    private readonly maxTimestamp = 2 ** TIMESTAMP_BITS - 1;

    encode(field: string, steps: SolutionStepInterface[], maxMistakes: number, isChallenge: boolean): string {
        if (field.length !== GRID_CELL_COUNT) {
            throw new Error('Invalid sudoku field length');
        }

        const givens = this.removeStepsFromField(field, steps);
        const out = new BitOutputStream();

        out.write(CODEC_VERSION, CODEC_VERSION_BITS);
        out.write(isChallenge ? 1 : 0, 1);
        out.write(0, CODEC_RESERVED_BITS);
        out.write(this.clampMaxMistakes(maxMistakes), MAX_MISTAKES_BITS);

        writeGivens(out, givens);

        if (isChallenge) {
            this.writeSteps(out, givens, steps);
        }

        return CODEC_PREFIX + bytesToBase64url(out.bytes());
    }

    decode(payload: string): [string, SolutionStepInterface[], number, boolean, number] {
        const input = new BitInputStream(base64urlToBytes(payload));

        const version = input.read(CODEC_VERSION_BITS);
        if (version !== CODEC_VERSION) {
            throw new Error('Unsupported game state version');
        }

        const isChallenge = input.read(1) === 1;
        input.read(CODEC_RESERVED_BITS);

        const maxMistakes = input.read(MAX_MISTAKES_BITS);
        const field = readGivens(input);
        const steps = isChallenge ? this.readSteps(input, field) : [];
        const elapsedTime = steps.reduce((total, step) => total + step.ts, 0);

        return [field, steps, maxMistakes, isChallenge, elapsedTime];
    }

    private clampMaxMistakes(maxMistakes: number): number {
        return Math.min(Math.max(Math.trunc(maxMistakes), 0), MAX_MISTAKES_LIMIT);
    }

    private clampTimestamp(ts: number): number {
        return Math.min(Math.max(Math.trunc(ts), 0), this.maxTimestamp);
    }

    private removeStepsFromField(field: string, steps: SolutionStepInterface[]): string {
        const chars = field.split('');

        for (const step of steps) {
            chars[step.cellIndex] = GRID_EMPTY_CELL;
        }

        return chars.join('');
    }

    private writeSteps(out: BitOutputStream, givens: string, steps: SolutionStepInterface[]): void {
        const emptyCells = collectEmptyCells(givens);
        if (steps.length > emptyCells.length) {
            throw new Error('Too many solution steps');
        }

        out.write(steps.length, STEP_COUNT_BITS);

        this.writeStepPositions(out, emptyCells, steps);
        writePackedValues(
            out,
            steps.map(step => step.value)
        );

        for (const step of steps) {
            out.write(this.clampTimestamp(step.ts), TIMESTAMP_BITS);
        }
    }

    private writeStepPositions(out: BitOutputStream, emptyCells: number[], steps: SolutionStepInterface[]): void {
        for (const step of steps) {
            const position = emptyCells.indexOf(step.cellIndex);
            if (position === -1) {
                throw new Error('Invalid solution step cell');
            }

            const width = getPositionBits(emptyCells.length);
            if (width > 0) {
                out.write(position, width);
            }

            emptyCells.splice(position, 1);
        }
    }

    private readSteps(input: BitInputStream, field: string): SolutionStepInterface[] {
        const emptyCells = collectEmptyCells(field);

        const count = input.read(STEP_COUNT_BITS);
        if (count > emptyCells.length) {
            throw new Error('Invalid solution step count');
        }

        const cellIndexes = this.readStepCellIndexes(input, emptyCells, count);
        const values = readPackedValues(input, count);

        const timestamps: number[] = [];
        for (let stepIndex = 0; stepIndex < count; stepIndex += 1) {
            timestamps.push(input.read(TIMESTAMP_BITS));
        }

        return cellIndexes.map((cellIndex, stepIndex) => ({
            cellIndex,
            value: values[stepIndex],
            ts: timestamps[stepIndex]
        }));
    }

    private readStepCellIndexes(input: BitInputStream, emptyCells: number[], count: number): number[] {
        const cellIndexes: number[] = [];

        for (let stepIndex = 0; stepIndex < count; stepIndex += 1) {
            const width = getPositionBits(emptyCells.length);
            const position = width > 0 ? input.read(width) : 0;

            if (position >= emptyCells.length) {
                throw new Error('Invalid solution step position');
            }

            cellIndexes.push(emptyCells[position]);
            emptyCells.splice(position, 1);
        }

        return cellIndexes;
    }
}
