import { BitmaskSolver } from '@suuudokuuu/solver-bitmask';
import { isCompleteValidGrid, UNIQUENESS_COUNT_LIMIT } from '@suuudokuuu/solver-core';

import { DIFFICULTY_BANDS } from '../../@generic/constants/difficulty-band.constant';

import type { SerializedPuzzleInterface } from '../../@generic/interfaces/serialized-puzzle.interface';
import type { DifficultyEnum } from '@suuudokuuu/generator';

export const isValidPuzzleResult = (result: SerializedPuzzleInterface, difficulty: DifficultyEnum): boolean => {
    const { sudokuString, solutionString, rating } = result;

    if (
        result.difficulty !== difficulty ||
        !/^[1-9.]{81}$/u.test(sudokuString) ||
        !/^[1-9]{81}$/u.test(solutionString) ||
        !Number.isFinite(rating) ||
        rating <= 0
    ) {
        return false;
    }

    const band = DIFFICULTY_BANDS[difficulty];
    const blankCells = sudokuString.split('.').length - 1;

    if (band.corpus === null && (blankCells === 0 || blankCells > band.blankCells)) {
        return false;
    }

    const grid = Uint8Array.from(sudokuString, digit => (digit === '.' ? 0 : Number(digit)));
    const solution = Uint8Array.from(solutionString, Number);

    return (
        isCompleteValidGrid(solution) &&
        grid.every((digit, index) => digit === 0 || digit === solution[index]) &&
        new BitmaskSolver().countSolutions(grid, UNIQUENESS_COUNT_LIMIT) === 1
    );
};
