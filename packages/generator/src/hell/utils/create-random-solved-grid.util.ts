import { GRID_CELL_COUNT, GRID_SIZE } from '@suuudokuuu/solver-core';

import type { SeededRandomType, SolverInterface } from '@suuudokuuu/solver-core';

export const createRandomSolvedGrid = (solver: SolverInterface, random: SeededRandomType): Uint8Array => {
    const seedGrid = new Uint8Array(GRID_CELL_COUNT);
    const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    for (let column = GRID_SIZE - 1; column >= 0; column -= 1) {
        const digitPosition = Math.floor(random() * digits.length);
        seedGrid[column] = digits[digitPosition];
        digits.splice(digitPosition, 1);
    }

    const solved = solver.solve(seedGrid);
    if (solved === null) {
        throw new Error('Unable to complete a seeded grid');
    }

    return solved;
};
