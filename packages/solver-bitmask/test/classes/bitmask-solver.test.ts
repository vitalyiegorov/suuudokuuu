import { GRID_CELL_COUNT, parseGridString } from '@suuudokuuu/solver-core';
import { collectSolverConformanceFailures } from '@suuudokuuu/solver-core/testing';
import { describe, expect, it } from 'vitest';

import { BitmaskSolver } from '../../src/classes/bitmask-solver';

const TWENTY_TWO_GIVEN_BLANK_CELL_COUNT = 59;
const NAKED_SINGLE_CONTRADICTION_FILLED_ROWS = '123456780000000009';
const NAKED_SINGLE_CONTRADICTION_TRAILING_BLANKS = '0'.repeat(GRID_CELL_COUNT - NAKED_SINGLE_CONTRADICTION_FILLED_ROWS.length);
const NAKED_SINGLE_CONTRADICTION = `${NAKED_SINGLE_CONTRADICTION_FILLED_ROWS}${NAKED_SINGLE_CONTRADICTION_TRAILING_BLANKS}`;

describe('BitmaskSolver', () => {
    it('passes the shared solver conformance cases', () => {
        expect(collectSolverConformanceFailures(new BitmaskSolver())).toEqual([]);
    });

    it('returns zero and null for a grid where a blank cell is left with no candidates', () => {
        const solver = new BitmaskSolver();
        const grid = parseGridString(NAKED_SINGLE_CONTRADICTION);

        expect(solver.countSolutions(grid, 2)).toBe(0);
        expect(solver.solve(grid)).toBeNull();
    });

    it('finds two solutions for a grid with only its final 22 cells given', () => {
        const grid = parseGridString(`${'0'.repeat(TWENTY_TWO_GIVEN_BLANK_CELL_COUNT)}5268856129743274836159`);

        expect(new BitmaskSolver().countSolutions(grid, 2)).toBe(2);
    });
});
