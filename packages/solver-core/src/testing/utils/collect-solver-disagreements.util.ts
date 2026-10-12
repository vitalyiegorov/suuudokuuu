import { UNIQUENESS_COUNT_LIMIT, GRID_CELL_COUNT, GRID_SIZE } from '../../constants/grid.constant';
import { createSeededRandom } from '../../utils/create-seeded-random.util';
import { formatGridString } from '../../utils/format-grid-string.util';

import type { SolverInterface } from '../../interfaces/solver.interface';
import type { SolverDisagreementOptionsInterface } from '../interfaces/solver-disagreement-options.interface';

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
        const grid = new Uint8Array(GRID_CELL_COUNT);
        for (let given = 0; given < targetGivensCount; given += 1) {
            grid[Math.floor(random() * GRID_CELL_COUNT)] = 1 + Math.floor(random() * GRID_SIZE);
        }
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
