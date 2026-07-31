import { describe, expect, it } from '@jest/globals';
import { GRID_CELL_COUNT, createSeededRandom } from '@suuudokuuu/solver-core';

import { shuffledCellIndexes } from './shuffled-cell-indexes.util';

const FIRST_SEED = 7;
const SECOND_SEED = 42;

describe('shuffledCellIndexes', () => {
    it('contains every cell index exactly once', () => {
        const cellIndexes = shuffledCellIndexes(createSeededRandom(FIRST_SEED));

        const sortedIndexes = Array.from(cellIndexes).sort((first, second) => first - second);
        const expectedIndexes = Array.from({ length: GRID_CELL_COUNT }, (_, index) => index);

        expect(sortedIndexes).toEqual(expectedIndexes);
    });

    it('is deterministic for the same seed', () => {
        const first = shuffledCellIndexes(createSeededRandom(FIRST_SEED));
        const second = shuffledCellIndexes(createSeededRandom(FIRST_SEED));

        expect(first).toEqual(second);
    });

    it('differs across seeds', () => {
        const first = shuffledCellIndexes(createSeededRandom(FIRST_SEED));
        const second = shuffledCellIndexes(createSeededRandom(SECOND_SEED));

        expect(first).not.toEqual(second);
    });
});
