import { describe, expect, it } from '@jest/globals';
import { BitmaskSolver } from '@suuudokuuu/solver-bitmask';
import { GRID_CELL_COUNT, UNIQUENESS_COUNT_LIMIT, createSeededRandom, parseGridString } from '@suuudokuuu/solver-core';

import { INFINITY_CORPUS_MINIMUM_RATING } from '../constants/infinity-corpus.constant';

import { pickInfinityPuzzle } from './pick-infinity-puzzle.util';

const DETERMINISM_SEED = 2026;
const SEED_SAMPLE_COUNT = 20;
const SAMPLE_SEED = 31;

describe('pickInfinityPuzzle', () => {
    it('is deterministic for a given seed', () => {
        const first = pickInfinityPuzzle(createSeededRandom(DETERMINISM_SEED));
        const second = pickInfinityPuzzle(createSeededRandom(DETERMINISM_SEED));

        expect(first).toEqual(second);
    });

    it('produces different puzzles for different seeds', () => {
        const outputs = new Set(
            Array.from({ length: SEED_SAMPLE_COUNT }, (_, seed) => pickInfinityPuzzle(createSeededRandom(seed)).puzzle)
        );

        expect(outputs.size).toBeGreaterThan(1);
    });

    it('returns a uniquely-solvable, curated-rating puzzle', () => {
        const { puzzle, rating } = pickInfinityPuzzle(createSeededRandom(SAMPLE_SEED));
        const bitmaskSolver = new BitmaskSolver();

        expect(puzzle).toHaveLength(GRID_CELL_COUNT);
        expect(bitmaskSolver.countSolutions(parseGridString(puzzle), UNIQUENESS_COUNT_LIMIT)).toBe(1);
        expect(rating).toBeGreaterThanOrEqual(INFINITY_CORPUS_MINIMUM_RATING);
    });
});
