import { describe, expect, it } from '@jest/globals';

import { collectSolverDisagreements } from './collect-solver-disagreements.util';

import type { SolverInterface } from '../interfaces/solver.interface';

const ITERATIONS = 5;
const RANDOM_SEED = 11;

const createFixedSolver = (solutionCount: number, isSolvable: boolean): SolverInterface => ({
    solve: () => (isSolvable ? new Uint8Array(0) : null),
    countSolutions: () => solutionCount
});

describe('collectSolverDisagreements', () => {
    it('reports no disagreements for two identical solvers', () => {
        const solverA = createFixedSolver(1, true);
        const solverB = createFixedSolver(1, true);

        expect(collectSolverDisagreements(solverA, solverB, ITERATIONS, RANDOM_SEED)).toEqual([]);
    });

    it('reports a count disagreement for every iteration when counts differ', () => {
        const solverA = createFixedSolver(1, true);
        const solverB = createFixedSolver(2, true);

        const disagreements = collectSolverDisagreements(solverA, solverB, ITERATIONS, RANDOM_SEED);

        expect(disagreements).toHaveLength(ITERATIONS);
        for (const disagreement of disagreements) {
            expect(disagreement).toContain('counts differ');
        }
    });

    it('reports a solvability disagreement for every iteration when solvability differs', () => {
        const solverA = createFixedSolver(1, true);
        const solverB = createFixedSolver(1, false);

        const disagreements = collectSolverDisagreements(solverA, solverB, ITERATIONS, RANDOM_SEED);

        expect(disagreements).toHaveLength(ITERATIONS);
        for (const disagreement of disagreements) {
            expect(disagreement).toContain('solvability differs');
        }
    });
});
