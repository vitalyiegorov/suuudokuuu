import { isDefined } from '@rnw-community/shared';

import { GRID_BLANK_VALUE, UNIQUENESS_COUNT_LIMIT } from '../../constants/grid.constant';
import { isCompleteValidGrid } from '../../utils/is-complete-valid-grid.util';
import { parseGridString } from '../../utils/parse-grid-string.util';
import { solverConformanceCases } from '../constants/solver-conformance-cases.constant';

import type { SolverInterface } from '../../interfaces/solver.interface';
import type { SolverConformanceCaseInterface } from '../interfaces/solver-conformance-case.interface';

const describeCountFailure = (
    conformanceCase: SolverConformanceCaseInterface,
    grid: Uint8Array,
    solver: SolverInterface
): string | null => {
    const inputGrid = grid.slice();
    const solutionCount = solver.countSolutions(inputGrid, conformanceCase.limit ?? UNIQUENESS_COUNT_LIMIT);
    if (!inputGrid.every((value, cell) => value === grid[cell])) {
        return `${conformanceCase.name}: countSolutions() mutated the input grid`;
    }
    if (solutionCount !== conformanceCase.expectedCount) {
        return `${conformanceCase.name}: expected count ${conformanceCase.expectedCount}, received ${solutionCount}`;
    }

    return null;
};

const describeSolveFailure = (
    conformanceCase: SolverConformanceCaseInterface,
    grid: Uint8Array,
    solver: SolverInterface
): string | null => {
    const inputGrid = grid.slice();
    const solution = solver.solve(inputGrid);
    if (!inputGrid.every((value, cell) => value === grid[cell])) {
        return `${conformanceCase.name}: solve() mutated the input grid`;
    }
    if (conformanceCase.expectedCount === 0) {
        return solution === null ? null : `${conformanceCase.name}: expected no solution from solve()`;
    }
    if (solution === null) {
        return `${conformanceCase.name}: solve() returned null`;
    }
    if (!isCompleteValidGrid(solution)) {
        return `${conformanceCase.name}: solve() returned an incomplete or invalid grid`;
    }
    if (!grid.every((value, cell) => value === GRID_BLANK_VALUE || value === solution[cell])) {
        return `${conformanceCase.name}: solve() result does not match the puzzle givens`;
    }

    return null;
};

export const collectSolverConformanceFailures = (solver: SolverInterface): string[] => {
    const failures: string[] = [];

    for (const conformanceCase of solverConformanceCases) {
        const grid = parseGridString(conformanceCase.puzzle);

        failures.push(
            ...[describeCountFailure(conformanceCase, grid, solver), describeSolveFailure(conformanceCase, grid, solver)].filter(isDefined)
        );
    }

    return failures;
};
