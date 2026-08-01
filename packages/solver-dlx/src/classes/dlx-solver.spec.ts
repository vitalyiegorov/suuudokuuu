import { describe, expect, it } from '@jest/globals';
import { collectSolverConformanceFailures, parseGridString } from '@suuudokuuu/solver-core';

import { DLXSolver } from './dlx-solver';

const EASY_PUZZLE = '530070000600195000098000060800060003400803001700020006060000280000419005000080079';
const UNSOLVABLE_PUZZLE = '130070000600195000098000060800060003400803001700020006060000280000419005000080079';
const TWENTY_SOLUTIONS_PUZZLE = '000000000000000000000000067859761423426853791713924856961537284287419605345286179';
const SIBLING_BUDGET_OVERSHOOT_PUZZLE = '000006000006000100700100050000000000800010000090000000000260900002000600000301500';
const SIBLING_BUDGET_LIMIT = 2;
const SIBLING_BUDGET_EXPECTED_COUNT = 2;
const TWENTY_SOLUTIONS_SMALL_LIMIT = 2;
const TWENTY_SOLUTIONS_LIMIT_BELOW_TOTAL = 7;

describe('DLXSolver', () => {
    it('passes the shared solver conformance cases', () => {
        expect(collectSolverConformanceFailures(new DLXSolver())).toEqual([]);
    });

    it('returns null when solving an unsolvable grid', () => {
        const solver = new DLXSolver();

        expect(solver.solve(parseGridString(UNSOLVABLE_PUZZLE))).toBeNull();
    });

    it('returns zero when counting solutions for an unsolvable grid', () => {
        const solver = new DLXSolver();

        expect(solver.countSolutions(parseGridString(UNSOLVABLE_PUZZLE), 2)).toBe(0);
    });

    it('stops counting once the requested limit is reached', () => {
        const solver = new DLXSolver();

        expect(solver.countSolutions(parseGridString(TWENTY_SOLUTIONS_PUZZLE), 1)).toBe(1);
    });

    it('counts every solution when the limit is above the total', () => {
        const solver = new DLXSolver();

        expect(solver.countSolutions(parseGridString(TWENTY_SOLUTIONS_PUZZLE), 100)).toBe(20);
    });

    it('does not overshoot the limit when sibling branches each have solutions', () => {
        const solver = new DLXSolver();

        expect(solver.countSolutions(parseGridString(SIBLING_BUDGET_OVERSHOOT_PUZZLE), SIBLING_BUDGET_LIMIT)).toBe(
            SIBLING_BUDGET_EXPECTED_COUNT
        );
    });

    it('stops at a small limit within a fixture that has many solutions', () => {
        const solver = new DLXSolver();

        expect(solver.countSolutions(parseGridString(TWENTY_SOLUTIONS_PUZZLE), TWENTY_SOLUTIONS_SMALL_LIMIT)).toBe(
            TWENTY_SOLUTIONS_SMALL_LIMIT
        );
    });

    it('caps the twenty-solution fixture at a limit of seven', () => {
        const solver = new DLXSolver();

        expect(solver.countSolutions(parseGridString(TWENTY_SOLUTIONS_PUZZLE), TWENTY_SOLUTIONS_LIMIT_BELOW_TOTAL)).toBe(
            TWENTY_SOLUTIONS_LIMIT_BELOW_TOTAL
        );
    });

    it('reuses the same instance across solve and countSolutions calls for different grids', () => {
        const solver = new DLXSolver();

        const firstSolution = solver.solve(parseGridString(EASY_PUZZLE));
        const solutionCount = solver.countSolutions(parseGridString(UNSOLVABLE_PUZZLE), 2);
        const secondSolution = solver.solve(parseGridString(EASY_PUZZLE));

        expect(firstSolution).toStrictEqual(secondSolution);
        expect(solutionCount).toBe(0);
    });
});
