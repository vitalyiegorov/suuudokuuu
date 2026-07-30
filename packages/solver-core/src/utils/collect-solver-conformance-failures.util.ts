import { GRID_BLANK_VALUE } from '../constants/grid.constant';
import { UNIQUENESS_COUNT_LIMIT, solverConformanceCases } from '../constants/solver-conformance-cases.constant';

import { isCompleteValidGrid } from './is-complete-valid-grid.util';
import { parseGridString } from './parse-grid-string.util';

import type { SolverInterface } from '../interfaces/solver.interface';

const matchesGivens = (givensGrid: Uint8Array, solutionGrid: Uint8Array): boolean =>
    givensGrid.every((value, cell) => value === GRID_BLANK_VALUE || value === solutionGrid[cell]);

export const collectSolverConformanceFailures = (solver: SolverInterface): string[] => {
    const failures: string[] = [];

    for (const conformanceCase of solverConformanceCases) {
        const grid = parseGridString(conformanceCase.puzzle);

        const solutionCount = solver.countSolutions(grid, UNIQUENESS_COUNT_LIMIT);
        if (solutionCount !== conformanceCase.expectedCount) {
            failures.push(`${conformanceCase.name}: expected count ${conformanceCase.expectedCount}, received ${solutionCount}`);
        }

        const solution = solver.solve(grid);
        const expectsNoSolution = conformanceCase.expectedCount === 0;
        if (expectsNoSolution) {
            if (solution !== null) {
                failures.push(`${conformanceCase.name}: expected no solution from solve()`);
            }
        } else if (solution === null || !isCompleteValidGrid(solution) || !matchesGivens(grid, solution)) {
            failures.push(`${conformanceCase.name}: solve() must return a valid completion of the givens`);
        }
    }

    return failures;
};
