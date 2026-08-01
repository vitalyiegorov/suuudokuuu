import { GRID_BLANK_VALUE, GRID_BOX_SIZE, GRID_CELL_COUNT, GRID_SIZE, formatGridString, parseGridString } from '@suuudokuuu/solver-core';

import { createRandomPermutation } from './create-random-permutation.util';

import type { SeededRandomType } from '@suuudokuuu/solver-core';

const TRANSPOSE_PROBABILITY = 0.5;

const createWithinBandPermutations = (random: SeededRandomType): number[][] =>
    Array.from({ length: GRID_BOX_SIZE }, () => createRandomPermutation(GRID_BOX_SIZE, random));

const buildAxisMapping = (bandPermutation: number[], withinBandPermutations: number[][]): number[] => {
    const mapping = new Array<number>(GRID_SIZE);

    for (let position = 0; position < GRID_SIZE; position += 1) {
        const band = Math.floor(position / GRID_BOX_SIZE);
        const positionInBand = position % GRID_BOX_SIZE;
        const sourceBand = bandPermutation[band];

        mapping[position] = sourceBand * GRID_BOX_SIZE + withinBandPermutations[sourceBand][positionInBand];
    }

    return mapping;
};

const createAxisMapping = (random: SeededRandomType): number[] =>
    buildAxisMapping(createRandomPermutation(GRID_BOX_SIZE, random), createWithinBandPermutations(random));

const createDigitMapping = (random: SeededRandomType): number[] => {
    const digitPermutation = createRandomPermutation(GRID_SIZE, random);

    return [GRID_BLANK_VALUE, ...digitPermutation.map(mappedDigit => mappedDigit + 1)];
};

const applyRowColumnMapping = (grid: Uint8Array, rowMapping: number[], columnMapping: number[]): Uint8Array => {
    const mapped = new Uint8Array(GRID_CELL_COUNT);

    for (let row = 0; row < GRID_SIZE; row += 1) {
        for (let column = 0; column < GRID_SIZE; column += 1) {
            mapped[row * GRID_SIZE + column] = grid[rowMapping[row] * GRID_SIZE + columnMapping[column]];
        }
    }

    return mapped;
};

const applyTranspose = (grid: Uint8Array): Uint8Array => {
    const transposed = new Uint8Array(GRID_CELL_COUNT);

    for (let row = 0; row < GRID_SIZE; row += 1) {
        for (let column = 0; column < GRID_SIZE; column += 1) {
            transposed[row * GRID_SIZE + column] = grid[column * GRID_SIZE + row];
        }
    }

    return transposed;
};

const applyDigitMapping = (grid: Uint8Array, digitMapping: number[]): Uint8Array => Uint8Array.from(grid, value => digitMapping[value]);

export const transformPuzzle = (puzzle: string, random: SeededRandomType): string => {
    const grid = parseGridString(puzzle);

    const rowMapping = createAxisMapping(random);
    const columnMapping = createAxisMapping(random);
    const digitMapping = createDigitMapping(random);
    const shouldTranspose = random() < TRANSPOSE_PROBABILITY;

    const rearranged = applyDigitMapping(applyRowColumnMapping(grid, rowMapping, columnMapping), digitMapping);

    return formatGridString(shouldTranspose ? applyTranspose(rearranged) : rearranged);
};
