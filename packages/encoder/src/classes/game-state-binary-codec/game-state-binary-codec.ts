import { BitInputStream, BitOutputStream } from '@thi.ng/bitstream';

import {
    CODEC_PREFIX,
    CODEC_RESERVED_BITS,
    CODEC_VERSION,
    CODEC_VERSION_BITS,
    MAX_MISTAKES_BITS,
    MAX_MISTAKES_LIMIT,
    STEP_COUNT_BITS,
    VALUE_BASE,
    VALUE_BASE_CUBED,
    VALUE_BASE_SQUARED,
    VALUE_PAIR_BITS,
    VALUE_PAIR_SIZE,
    VALUE_TRIPLET_BITS,
    VALUE_TRIPLET_SIZE
} from '../../constants/binary-codec.constant';
import { TIMESTAMP_BITS, VALUE_BITS } from '../../constants/bit-encoding.constant';
import { GRID_CELL_COUNT, GRID_EMPTY_CELL } from '../../constants/grid.constant';
import { base64urlToBytes } from '../../util/base64url-to-bytes.util';
import { bytesToBase64url } from '../../util/bytes-to-base64url.util';
import { isValidCellValue } from '../../util/is-valid-cell-value.util';

import type { SolutionStepInterface } from '../../interfaces/solution-step.interface';

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

        this.writeGivens(out, givens);

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
        const field = this.readGivens(input);
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

    private collectEmptyCells(field: string): number[] {
        const emptyCells: number[] = [];

        for (let cellIndex = 0; cellIndex < GRID_CELL_COUNT; cellIndex += 1) {
            if (field.charAt(cellIndex) === GRID_EMPTY_CELL) {
                emptyCells.push(cellIndex);
            }
        }

        return emptyCells;
    }

    private getPositionBits(length: number): number {
        let bits = 0;
        let capacity = 1;

        while (capacity < length) {
            bits += 1;
            capacity *= 2;
        }

        return bits;
    }

    private writeGivens(out: BitOutputStream, givens: string): void {
        const values: number[] = [];

        for (let cellIndex = 0; cellIndex < GRID_CELL_COUNT; cellIndex += 1) {
            const char = givens.charAt(cellIndex);
            const isGiven = char !== GRID_EMPTY_CELL;

            out.write(isGiven ? 1 : 0, 1);

            if (isGiven) {
                values.push(parseInt(char, 10));
            }
        }

        this.writeValues(out, values);
    }

    private readGivens(input: BitInputStream): string {
        const mask: boolean[] = [];

        for (let cellIndex = 0; cellIndex < GRID_CELL_COUNT; cellIndex += 1) {
            mask.push(input.read(1) === 1);
        }

        const values = this.readValues(input, mask.filter(Boolean).length);

        let result = '';
        let valueIndex = 0;
        for (const isGiven of mask) {
            if (isGiven) {
                result += values[valueIndex].toString();
                valueIndex += 1;
            } else {
                result += GRID_EMPTY_CELL;
            }
        }

        return result;
    }

    private writeSteps(out: BitOutputStream, givens: string, steps: SolutionStepInterface[]): void {
        const emptyCells = this.collectEmptyCells(givens);
        if (steps.length > emptyCells.length) {
            throw new Error('Too many solution steps');
        }

        out.write(steps.length, STEP_COUNT_BITS);

        this.writeStepPositions(out, emptyCells, steps);
        this.writeValues(
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

            const width = this.getPositionBits(emptyCells.length);
            if (width > 0) {
                out.write(position, width);
            }

            emptyCells.splice(position, 1);
        }
    }

    private readSteps(input: BitInputStream, field: string): SolutionStepInterface[] {
        const emptyCells = this.collectEmptyCells(field);

        const count = input.read(STEP_COUNT_BITS);
        if (count > emptyCells.length) {
            throw new Error('Invalid solution step count');
        }

        const cellIndexes = this.readStepCellIndexes(input, emptyCells, count);
        const values = this.readValues(input, count);

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
            const width = this.getPositionBits(emptyCells.length);
            const position = width > 0 ? input.read(width) : 0;

            if (position >= emptyCells.length) {
                throw new Error('Invalid solution step position');
            }

            cellIndexes.push(emptyCells[position]);
            emptyCells.splice(position, 1);
        }

        return cellIndexes;
    }

    private writeValues(out: BitOutputStream, values: number[]): void {
        for (const value of values) {
            if (!isValidCellValue(value)) {
                throw new Error('Invalid sudoku cell value');
            }
        }

        let index = 0;
        while (values.length - index >= VALUE_TRIPLET_SIZE) {
            const packed = (values[index] - 1) * VALUE_BASE_SQUARED + (values[index + 1] - 1) * VALUE_BASE + (values[index + 2] - 1);

            out.write(packed, VALUE_TRIPLET_BITS);
            index += VALUE_TRIPLET_SIZE;
        }

        const remaining = values.length - index;
        if (remaining === VALUE_PAIR_SIZE) {
            out.write((values[index] - 1) * VALUE_BASE + (values[index + 1] - 1), VALUE_PAIR_BITS);
        } else if (remaining === 1) {
            out.write(values[index] - 1, VALUE_BITS);
        }
    }

    private readValues(input: BitInputStream, count: number): number[] {
        const values: number[] = [];

        while (count - values.length >= VALUE_TRIPLET_SIZE) {
            const packed = input.read(VALUE_TRIPLET_BITS);
            if (packed >= VALUE_BASE_CUBED) {
                throw new Error('Invalid packed cell values');
            }

            values.push(
                Math.floor(packed / VALUE_BASE_SQUARED) + 1,
                (Math.floor(packed / VALUE_BASE) % VALUE_BASE) + 1,
                (packed % VALUE_BASE) + 1
            );
        }

        this.readRemainingValues(input, count - values.length, values);

        return values;
    }

    private readRemainingValues(input: BitInputStream, remaining: number, values: number[]): void {
        if (remaining === VALUE_PAIR_SIZE) {
            const packed = input.read(VALUE_PAIR_BITS);
            if (packed >= VALUE_BASE_SQUARED) {
                throw new Error('Invalid packed cell values');
            }

            values.push(Math.floor(packed / VALUE_BASE) + 1, (packed % VALUE_BASE) + 1);
        } else if (remaining === 1) {
            const packed = input.read(VALUE_BITS);
            if (packed >= VALUE_BASE) {
                throw new Error('Invalid packed cell values');
            }

            values.push(packed + 1);
        }
    }
}
