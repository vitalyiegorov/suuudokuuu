import { UNIQUENESS_COUNT_LIMIT } from '../constants/solver-conformance-cases.constant';

import { createRandomPartialGrid } from './create-random-partial-grid.util';
import { createSeededRandom } from './create-seeded-random.util';

import type { SolverInterface } from '../interfaces/solver.interface';

const MIN_RANDOM_GIVENS = 15;
const RANDOM_GIVENS_SPAN = 16;

export const collectSolverDisagreements = (
    solverA: SolverInterface,
    solverB: SolverInterface,
    iterations: number,
    randomSeed: number
): string[] => {
    const random = createSeededRandom(randomSeed);
    const disagreements: string[] = [];

    for (let iteration = 0; iteration < iterations; iteration += 1) {
        const givensCount = MIN_RANDOM_GIVENS + Math.floor(random() * RANDOM_GIVENS_SPAN);
        const grid = createRandomPartialGrid(random, givensCount);

        const countFromSolverA = solverA.countSolutions(grid, UNIQUENESS_COUNT_LIMIT);
        const countFromSolverB = solverB.countSolutions(grid, UNIQUENESS_COUNT_LIMIT);
        if (countFromSolverA !== countFromSolverB) {
            disagreements.push(`iteration ${iteration}: counts differ (${countFromSolverA} vs ${countFromSolverB})`);
        }

        const isSolvableBySolverA = solverA.solve(grid) !== null;
        const isSolvableBySolverB = solverB.solve(grid) !== null;
        if (isSolvableBySolverA !== isSolvableBySolverB) {
            disagreements.push(
                `iteration ${iteration}: solvability differs (${String(isSolvableBySolverA)} vs ${String(isSolvableBySolverB)})`
            );
        }
    }

    return disagreements;
};
