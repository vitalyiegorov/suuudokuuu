import { describe, expect, it } from '@jest/globals';
import { GRID_BLANK_VALUE, UNIQUENESS_COUNT_LIMIT, parseGridString } from '@suuudokuuu/solver-core';
import { DLXSolver } from '@suuudokuuu/solver-dlx';

import { BitmaskSolver } from './bitmask-solver';

import type { SolverInterface } from '@suuudokuuu/solver-core';

const BENCHMARK_ITERATIONS_PER_ENGINE = 200;
const BENCHMARK_WARMUP_ITERATIONS_PER_ENGINE = 20;
const BENCHMARK_BLANKED_CELL_COUNT = 59;
const MINIMUM_ELAPSED_MILLISECONDS = 1;
const MILLISECONDS_PER_SECOND = 1000;

const ROYLE_17_PUZZLE = '000000010400000000020000000000050407008000300001090000300400200050100000000806000';

const measureChecksPerSecond = (solver: SolverInterface, grid: Uint8Array, iterations: number): number => {
    for (let warmUpIteration = 0; warmUpIteration < BENCHMARK_WARMUP_ITERATIONS_PER_ENGINE; warmUpIteration += 1) {
        solver.countSolutions(grid, UNIQUENESS_COUNT_LIMIT);
    }

    const start = performance.now();
    for (let iteration = 0; iteration < iterations; iteration += 1) {
        solver.countSolutions(grid, UNIQUENESS_COUNT_LIMIT);
    }

    return Math.round((iterations / Math.max(MINIMUM_ELAPSED_MILLISECONDS, performance.now() - start)) * MILLISECONDS_PER_SECOND);
};

const deriveRoyleSolution = (): Uint8Array => {
    const solution = new DLXSolver().solve(parseGridString(ROYLE_17_PUZZLE));

    if (solution === null) {
        throw new Error('Expected the Royle 17-given puzzle to be solvable when deriving the benchmark grid');
    }

    return solution;
};

const createFixedTwentyTwoGivenGrid = (): Uint8Array => {
    const grid = Uint8Array.from(deriveRoyleSolution());

    for (let cell = 0; cell < BENCHMARK_BLANKED_CELL_COUNT; cell += 1) {
        grid[cell] = GRID_BLANK_VALUE;
    }

    return grid;
};

describe('BitmaskSolver benchmark', () => {
    it('measures countSolutions throughput for both engines on the Royle 17-given puzzle', () => {
        const grid = parseGridString(ROYLE_17_PUZZLE);

        const dlxCountPerSecond = measureChecksPerSecond(new DLXSolver(), grid, BENCHMARK_ITERATIONS_PER_ENGINE);
        const bitmaskCountPerSecond = measureChecksPerSecond(new BitmaskSolver(), grid, BENCHMARK_ITERATIONS_PER_ENGINE);
        const dlxSolutionCount = new DLXSolver().countSolutions(grid, UNIQUENESS_COUNT_LIMIT);
        const bitmaskSolutionCount = new BitmaskSolver().countSolutions(grid, UNIQUENESS_COUNT_LIMIT);

        expect(dlxCountPerSecond).toBeGreaterThan(0);
        expect(bitmaskCountPerSecond).toBeGreaterThan(0);
        expect(dlxSolutionCount).toBe(bitmaskSolutionCount);
    });

    it('measures countSolutions throughput for both engines on a fixed 22-given grid', () => {
        const grid = createFixedTwentyTwoGivenGrid();

        const dlxCountPerSecond = measureChecksPerSecond(new DLXSolver(), grid, BENCHMARK_ITERATIONS_PER_ENGINE);
        const bitmaskCountPerSecond = measureChecksPerSecond(new BitmaskSolver(), grid, BENCHMARK_ITERATIONS_PER_ENGINE);
        const dlxSolutionCount = new DLXSolver().countSolutions(grid, UNIQUENESS_COUNT_LIMIT);
        const bitmaskSolutionCount = new BitmaskSolver().countSolutions(grid, UNIQUENESS_COUNT_LIMIT);

        expect(dlxCountPerSecond).toBeGreaterThan(0);
        expect(bitmaskCountPerSecond).toBeGreaterThan(0);
        expect(dlxSolutionCount).toBe(bitmaskSolutionCount);
    });
});
