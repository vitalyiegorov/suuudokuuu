import { describe, expect, it } from '@jest/globals';
import { BitmaskSolver } from '@suuudokuuu/solver-bitmask';
import {
    GRID_BLANK_VALUE,
    GRID_CELL_COUNT,
    UNIQUENESS_COUNT_LIMIT,
    createSeededRandom,
    formatGridString,
    parseGridString
} from '@suuudokuuu/solver-core';

import { countGivens } from './count-givens.util';
import { createRandomSolvedGrid } from './create-random-solved-grid.util';
import { reduceToMinimalPuzzle } from './reduce-to-minimal-puzzle.util';

const SEED = 7;
const MAXIMUM_MINIMAL_GIVENS = 30;
const ROYLE_17 = '000000010400000000020000000000050407008000300001090000300400200050100000000806000';

describe('reduceToMinimalPuzzle', () => {
    it('reduces a solved grid to a puzzle with a unique solution and a bounded number of givens', () => {
        const solver = new BitmaskSolver();
        const grid = createRandomSolvedGrid(solver, createSeededRandom(SEED));

        reduceToMinimalPuzzle(grid, solver, createSeededRandom(SEED));

        expect(solver.countSolutions(grid, UNIQUENESS_COUNT_LIMIT)).toBe(1);
        expect(countGivens(grid)).toBeLessThanOrEqual(MAXIMUM_MINIMAL_GIVENS);
    });

    it('produces a minimal puzzle where blanking any remaining given breaks uniqueness', () => {
        const solver = new BitmaskSolver();
        const grid = createRandomSolvedGrid(solver, createSeededRandom(SEED));

        reduceToMinimalPuzzle(grid, solver, createSeededRandom(SEED));

        const remainingGivenCells: number[] = [];
        for (let cell = 0; cell < GRID_CELL_COUNT; cell += 1) {
            if (grid[cell] !== GRID_BLANK_VALUE) {
                remainingGivenCells.push(cell);
            }
        }

        for (const cell of remainingGivenCells) {
            const backup = grid[cell];
            grid[cell] = GRID_BLANK_VALUE;

            expect(solver.countSolutions(grid, UNIQUENESS_COUNT_LIMIT)).toBe(UNIQUENESS_COUNT_LIMIT);

            grid[cell] = backup;
        }
    });

    it('leaves an already-minimal puzzle unchanged', () => {
        const solver = new BitmaskSolver();
        const grid = parseGridString(ROYLE_17);

        reduceToMinimalPuzzle(grid, solver, createSeededRandom(SEED));

        expect(formatGridString(grid)).toBe(ROYLE_17);
    });
});
