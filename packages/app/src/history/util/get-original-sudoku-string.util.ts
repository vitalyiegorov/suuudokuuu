import { EMPTY_CELL } from '../constants/grid.constant';

import type { SolutionStepInterface } from '../interfaces/solution-step.interface';

/**
 * Reconstructs the original sudoku puzzle string by clearing cells that were filled during gameplay.
 * Assumes that solutionSteps only contains cells that were originally empty (dots in the sudoku string).
 */
export const getOriginalSudokuString = (sudokuString: string, solutionSteps: SolutionStepInterface[]): string => {
    const chars = sudokuString.split('');

    for (const step of solutionSteps) {
        chars[step.cellIndex] = EMPTY_CELL;
    }

    return chars.join('');
};
