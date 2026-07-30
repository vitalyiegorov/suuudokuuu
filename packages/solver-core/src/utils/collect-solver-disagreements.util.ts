import { UNIQUENESS_COUNT_LIMIT } from '../constants/solver-conformance-cases.constant';

import { createRandomPartialGrid } from './create-random-partial-grid.util';
import { createSeededRandom } from './create-seeded-random.util';
import { formatGridString } from './format-grid-string.util';

import type { SolverDisagreementOptionsInterface } from '../interfaces/solver-disagreement-options.interface';
import type { SolverInterface } from '../interfaces/solver.interface';

const MIN_RANDOM_GIVENS = 15;
const RANDOM_GIVENS_SPAN = 16;

export const collectSolverDisagreements = (
    solverA: SolverInterface,
    solverB: SolverInterface,
    options: SolverDisagreementOptionsInterface
): string[] => {
    const random = createSeededRandom(options.randomSeed);
    const disagreements: string[] = [];

    for (let iteration = 0; iteration < options.iterations; iteration += 1) {
        const targetGivensCount = MIN_RANDOM_GIVENS + Math.floor(random() * RANDOM_GIVENS_SPAN);
        const grid = createRandomPartialGrid(random, targetGivensCount);
        const gridDescription = formatGridString(grid);

        const countFromSolverA = solverA.countSolutions(grid, UNIQUENESS_COUNT_LIMIT);
        const countFromSolverB = solverB.countSolutions(grid, UNIQUENESS_COUNT_LIMIT);
        if (countFromSolverA !== countFromSolverB) {
            disagreements.push(
                `iteration ${iteration} grid ${gridDescription}: counts differ (${countFromSolverA} vs ${countFromSolverB})`
            );
        }

        const isSolvableBySolverA = solverA.solve(grid) !== null;
        const isSolvableBySolverB = solverB.solve(grid) !== null;
        if (isSolvableBySolverA !== isSolvableBySolverB) {
            disagreements.push(
                `iteration ${iteration} grid ${gridDescription}: solvability differs (${String(isSolvableBySolverA)} vs ${String(isSolvableBySolverB)})`
            );
        }
    }

    return disagreements;
};
