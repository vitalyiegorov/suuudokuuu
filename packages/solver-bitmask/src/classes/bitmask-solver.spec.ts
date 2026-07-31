import { describe, expect, it } from '@jest/globals';
import { GRID_CELL_COUNT, collectSolverConformanceFailures, parseGridString } from '@suuudokuuu/solver-core';

import { BitmaskSolver } from './bitmask-solver';

const ROYLE_17 = '000000010400000000020000000000050407008000300001090000300400200050100000000806000';
const TWENTY_SOLUTIONS_PUZZLE = '000000000000000000000000067859761423426853791713924856961537284287419605345286179';
const DUPLICATE_GIVEN_IN_BOX = `7${'0'.repeat(9)}7${'0'.repeat(70)}`;
const UNSOLVABLE_PUZZLE = '130070000600195000098000060800060003400803001700020006060000280000419005000080079';
const NAKED_SINGLE_CONTRADICTION_FILLED_ROWS = '123456780000000009';
const NAKED_SINGLE_CONTRADICTION_TRAILING_BLANKS = '0'.repeat(GRID_CELL_COUNT - NAKED_SINGLE_CONTRADICTION_FILLED_ROWS.length);
const NAKED_SINGLE_CONTRADICTION = `${NAKED_SINGLE_CONTRADICTION_FILLED_ROWS}${NAKED_SINGLE_CONTRADICTION_TRAILING_BLANKS}`;
const EXPECTED_TWENTY_SOLUTIONS_COUNT = 20;

describe('BitmaskSolver', () => {
    it('passes the shared solver conformance cases', () => {
        expect(collectSolverConformanceFailures(new BitmaskSolver())).toEqual([]);
    });

    it('is reusable across calls without state leakage', () => {
        const solver = new BitmaskSolver();
        const grid = parseGridString(ROYLE_17);

        expect(solver.countSolutions(grid, 2)).toBe(1);
        expect(solver.countSolutions(grid, 2)).toBe(1);
        expect(solver.solve(grid)).not.toBeNull();
        expect(solver.countSolutions(grid, 2)).toBe(1);
    });

    it('does not mutate the input grid', () => {
        const solver = new BitmaskSolver();
        const grid = parseGridString(ROYLE_17);
        const snapshot = Uint8Array.from(grid);

        solver.countSolutions(grid, 2);
        solver.solve(grid);

        expect(grid).toEqual(snapshot);
    });

    it('returns zero and null for a grid with a duplicate given in the same box', () => {
        const solver = new BitmaskSolver();
        const grid = parseGridString(DUPLICATE_GIVEN_IN_BOX);

        expect(solver.countSolutions(grid, 2)).toBe(0);
        expect(solver.solve(grid)).toBeNull();
    });

    it('returns zero and null for a grid that is unsolvable without conflicting givens', () => {
        const solver = new BitmaskSolver();
        const grid = parseGridString(UNSOLVABLE_PUZZLE);

        expect(solver.countSolutions(grid, 2)).toBe(0);
        expect(solver.solve(grid)).toBeNull();
    });

    it('returns zero and null for a grid where a blank cell is left with no candidates', () => {
        const solver = new BitmaskSolver();
        const grid = parseGridString(NAKED_SINGLE_CONTRADICTION);

        expect(solver.countSolutions(grid, 2)).toBe(0);
        expect(solver.solve(grid)).toBeNull();
    });

    it('stops counting once the requested limit is reached', () => {
        const solver = new BitmaskSolver();
        const grid = parseGridString(TWENTY_SOLUTIONS_PUZZLE);

        expect(solver.countSolutions(grid, 1)).toBe(1);
    });

    it('counts every solution when the limit is above the total', () => {
        const solver = new BitmaskSolver();
        const grid = parseGridString(TWENTY_SOLUTIONS_PUZZLE);

        expect(solver.countSolutions(grid, 100)).toBe(EXPECTED_TWENTY_SOLUTIONS_COUNT);
    });

    it('reuses the same instance across solve and countSolutions calls for different grids', () => {
        const solver = new BitmaskSolver();

        const firstSolution = solver.solve(parseGridString(ROYLE_17));
        const solutionCount = solver.countSolutions(parseGridString(DUPLICATE_GIVEN_IN_BOX), 2);
        const secondSolution = solver.solve(parseGridString(ROYLE_17));

        expect(firstSolution).toStrictEqual(secondSolution);
        expect(solutionCount).toBe(0);
    });
});
