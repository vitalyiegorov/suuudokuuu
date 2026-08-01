import { describe, expect, it } from '@jest/globals';
import { createSeededRandom } from '@suuudokuuu/solver-core';

import { createRandomPermutation } from './create-random-permutation.util';

const PERMUTATION_SIZE = 9;
const TRIVIAL_PERMUTATION_SIZE = 1;
const FIRST_SEED = 1;
const SECOND_SEED = 2;
const DETERMINISM_SEED = 42;

describe('createRandomPermutation', () => {
    it('returns a permutation containing every index exactly once', () => {
        const permutation = createRandomPermutation(PERMUTATION_SIZE, createSeededRandom(FIRST_SEED));

        expect([...permutation].sort((left, right) => left - right)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it('is deterministic for a given seed', () => {
        const first = createRandomPermutation(PERMUTATION_SIZE, createSeededRandom(DETERMINISM_SEED));
        const second = createRandomPermutation(PERMUTATION_SIZE, createSeededRandom(DETERMINISM_SEED));

        expect(first).toEqual(second);
    });

    it('produces different permutations for different seeds', () => {
        const first = createRandomPermutation(PERMUTATION_SIZE, createSeededRandom(FIRST_SEED));
        const second = createRandomPermutation(PERMUTATION_SIZE, createSeededRandom(SECOND_SEED));

        expect(first).not.toEqual(second);
    });

    it('returns the trivial permutation for size one', () => {
        expect(createRandomPermutation(TRIVIAL_PERMUTATION_SIZE, createSeededRandom(FIRST_SEED))).toEqual([0]);
    });
});
