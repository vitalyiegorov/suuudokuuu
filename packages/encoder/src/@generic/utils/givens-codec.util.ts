import {
    VALUE_BASE,
    VALUE_BASE_CUBED,
    VALUE_BASE_SQUARED,
    VALUE_PAIR_BITS,
    VALUE_PAIR_SIZE,
    VALUE_TRIPLET_BITS,
    VALUE_TRIPLET_SIZE
} from '../constants/binary-codec.constant';
import { VALUE_BITS } from '../constants/bit-encoding.constant';
import { GRID_CELL_COUNT, GRID_EMPTY_CELL } from '../constants/grid.constant';

import { isValidCellValue } from './is-valid-cell-value.util';

import type { BitInputStream, BitOutputStream } from '@thi.ng/bitstream';

export const writePackedValues = (out: BitOutputStream, values: number[]): void => {
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
};

const readRemainingPackedValues = (input: BitInputStream, remaining: number, values: number[]): void => {
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
};

export const readPackedValues = (input: BitInputStream, count: number): number[] => {
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

    readRemainingPackedValues(input, count - values.length, values);

    return values;
};

export const writeGivens = (out: BitOutputStream, givens: string): void => {
    const values: number[] = [];

    for (let cellIndex = 0; cellIndex < GRID_CELL_COUNT; cellIndex += 1) {
        const char = givens.charAt(cellIndex);
        const isGiven = char !== GRID_EMPTY_CELL;

        out.write(isGiven ? 1 : 0, 1);

        if (isGiven) {
            values.push(parseInt(char, 10));
        }
    }

    writePackedValues(out, values);
};

export const readGivens = (input: BitInputStream): string => {
    const mask: boolean[] = [];

    for (let cellIndex = 0; cellIndex < GRID_CELL_COUNT; cellIndex += 1) {
        mask.push(input.read(1) === 1);
    }

    const values = readPackedValues(input, mask.filter(Boolean).length);

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
};

export const collectEmptyCells = (field: string): number[] => {
    const emptyCells: number[] = [];

    for (let cellIndex = 0; cellIndex < GRID_CELL_COUNT; cellIndex += 1) {
        if (field.charAt(cellIndex) === GRID_EMPTY_CELL) {
            emptyCells.push(cellIndex);
        }
    }

    return emptyCells;
};

export const getPositionBits = (length: number): number => {
    let bits = 0;
    let capacity = 1;

    while (capacity < length) {
        bits += 1;
        capacity *= 2;
    }

    return bits;
};
