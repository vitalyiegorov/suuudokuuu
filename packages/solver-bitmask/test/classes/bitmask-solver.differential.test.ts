import { collectSolverDisagreements } from '@suuudokuuu/solver-core';
import { DLXSolver } from '@suuudokuuu/solver-dlx';
import { describe, expect, it } from 'vitest';

import { BitmaskSolver } from '../../src/classes/bitmask-solver';

const DIFFERENTIAL_ITERATIONS = 2000;
const DIFFERENTIAL_RANDOM_SEED = 20260730;

describe('BitmaskSolver differential', () => {
    it('agrees with DLXSolver across 2000 seeded random grids', () => {
        expect(
            collectSolverDisagreements(new BitmaskSolver(), new DLXSolver(), {
                iterations: DIFFERENTIAL_ITERATIONS,
                randomSeed: DIFFERENTIAL_RANDOM_SEED
            })
        ).toEqual([]);
    });
});
