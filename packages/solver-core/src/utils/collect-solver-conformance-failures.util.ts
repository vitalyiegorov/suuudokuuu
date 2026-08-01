import { isDefined } from '@rnw-community/shared';

import { GRID_BLANK_VALUE } from '../constants/grid.constant';
import { UNIQUENESS_COUNT_LIMIT, solverConformanceCases } from '../constants/solver-conformance-cases.constant';

import { isCompleteValidGrid } from './is-complete-valid-grid.util';
import { parseGridString } from './parse-grid-string.util';

import type { SolverConformanceCaseInterface } from '../interfaces/solver-conformance-case.interface';
import type { SolverInterface } from '../interfaces/solver.interface';

const matchesGivens = (givensGrid: Uint8Array, solutionGrid: Uint8Array): boolean =>
    givensGrid.every((value, cell) => value === GRID_BLANK_VALUE || value === solutionGrid[cell]);

const describeSolveFailure = (
    conformanceCase: SolverConformanceCaseInterface,
    grid: Uint8Array,
    solution: Uint8Array | null
): string | null => {
    if (conformanceCase.expectedCount === 0) {
        return solution === null ? null : `${conformanceCase.name}: expected no solution from solve()`;
    }
    if (solution === null) {
        return `${conformanceCase.name}: solve() returned null`;
    }
    if (!isCompleteValidGrid(solution)) {
        return `${conformanceCase.name}: solve() returned an incomplete or invalid grid`;
    }
    if (!matchesGivens(grid, solution)) {
        return `${conformanceCase.name}: solve() result does not match the puzzle givens`;
    }

    return null;
};

export const collectSolverConformanceFailures = (solver: SolverInterface): string[] => {
    const failures: string[] = [];

    for (const conformanceCase of solverConformanceCases) {
        const grid = parseGridString(conformanceCase.puzzle);

        const solutionCount = solver.countSolutions(grid, UNIQUENESS_COUNT_LIMIT);
        if (solutionCount !== conformanceCase.expectedCount) {
            failures.push(`${conformanceCase.name}: expected count ${conformanceCase.expectedCount}, received ${solutionCount}`);
        }

        const solveFailure = describeSolveFailure(conformanceCase, grid, solver.solve(grid));
        if (isDefined(solveFailure)) {
            failures.push(solveFailure);
        }
    }

    return failures;
};
