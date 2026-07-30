import { describe, expect, it } from '@jest/globals';

import { collectSolverDisagreements } from './collect-solver-disagreements.util';

import type { SolverDisagreementOptionsInterface } from '../interfaces/solver-disagreement-options.interface';
import type { SolverInterface } from '../interfaces/solver.interface';

const ITERATIONS = 5;
const RANDOM_SEED = 11;
const DISAGREEMENT_OPTIONS: SolverDisagreementOptionsInterface = { iterations: ITERATIONS, randomSeed: RANDOM_SEED };
const GRID_DIGITS_PATTERN = '\\d{81}';

const createFixedSolver = (solutionCount: number, isSolvable: boolean): SolverInterface => ({
    solve: () => (isSolvable ? new Uint8Array(0) : null),
    countSolutions: () => solutionCount
});

describe('collectSolverDisagreements', () => {
    it('reports no disagreements for two identical solvers', () => {
        const solverA = createFixedSolver(1, true);
        const solverB = createFixedSolver(1, true);

        expect(collectSolverDisagreements(solverA, solverB, DISAGREEMENT_OPTIONS)).toEqual([]);
    });

    it('reports a count disagreement for every iteration when counts differ', () => {
        const solverA = createFixedSolver(1, true);
        const solverB = createFixedSolver(2, true);

        const disagreements = collectSolverDisagreements(solverA, solverB, DISAGREEMENT_OPTIONS);

        expect(disagreements).toHaveLength(ITERATIONS);
        disagreements.forEach((disagreement, iteration) => {
            expect(disagreement).toMatch(
                new RegExp(`^iteration ${iteration} grid ${GRID_DIGITS_PATTERN}: counts differ \\(1 vs 2\\)$`, 'u')
            );
        });
    });

    it('reports a solvability disagreement for every iteration when solvability differs', () => {
        const solverA = createFixedSolver(1, true);
        const solverB = createFixedSolver(1, false);

        const disagreements = collectSolverDisagreements(solverA, solverB, DISAGREEMENT_OPTIONS);

        expect(disagreements).toHaveLength(ITERATIONS);
        disagreements.forEach((disagreement, iteration) => {
            expect(disagreement).toMatch(
                new RegExp(`^iteration ${iteration} grid ${GRID_DIGITS_PATTERN}: solvability differs \\(true vs false\\)$`, 'u')
            );
        });
    });
});
