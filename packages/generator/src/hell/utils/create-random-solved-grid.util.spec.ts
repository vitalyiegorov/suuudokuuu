import { describe, expect, it } from '@jest/globals';
import { BitmaskSolver } from '@suuudokuuu/solver-bitmask';
import { createSeededRandom, isCompleteValidGrid } from '@suuudokuuu/solver-core';

import { createRandomSolvedGrid } from './create-random-solved-grid.util';

import type { SolverInterface } from '@suuudokuuu/solver-core';

const FIRST_SEED = 7;
const SECOND_SEED = 42;

describe('createRandomSolvedGrid', () => {
    it('returns a complete valid grid', () => {
        const solver = new BitmaskSolver();

        const grid = createRandomSolvedGrid(solver, createSeededRandom(FIRST_SEED));

        expect(isCompleteValidGrid(grid)).toBe(true);
    });

    it('is deterministic for the same seed', () => {
        const first = createRandomSolvedGrid(new BitmaskSolver(), createSeededRandom(FIRST_SEED));
        const second = createRandomSolvedGrid(new BitmaskSolver(), createSeededRandom(FIRST_SEED));

        expect(first).toEqual(second);
    });

    it('differs across seeds', () => {
        const first = createRandomSolvedGrid(new BitmaskSolver(), createSeededRandom(FIRST_SEED));
        const second = createRandomSolvedGrid(new BitmaskSolver(), createSeededRandom(SECOND_SEED));

        expect(first).not.toEqual(second);
    });

    it('throws when the solver cannot complete the seeded grid', () => {
        const unsolvableSolver: SolverInterface = {
            solve: () => null,
            countSolutions: () => 0
        };

        expect(() => createRandomSolvedGrid(unsolvableSolver, createSeededRandom(FIRST_SEED))).toThrow('Unable to complete a seeded grid');
    });
});
