import { GRID_BLANK_VALUE, UNIQUENESS_COUNT_LIMIT } from '@suuudokuuu/solver-core';

import { shuffledCellIndexes } from './shuffled-cell-indexes.util';

import type { SeededRandomType, SolverInterface } from '@suuudokuuu/solver-core';

export const reduceToMinimalPuzzle = (grid: Uint8Array, solver: SolverInterface, random: SeededRandomType): void => {
    for (const cell of shuffledCellIndexes(random)) {
        if (grid[cell] !== GRID_BLANK_VALUE) {
            const backup = grid[cell];
            grid[cell] = GRID_BLANK_VALUE;

            if (solver.countSolutions(grid, UNIQUENESS_COUNT_LIMIT) !== 1) {
                grid[cell] = backup;
            }
        }
    }
};
