import { EMPTY_CELL } from '../constants/grid.constant';

import type { SolutionStepInterface } from '../interfaces/solution-step.interface';

export const getOriginalSudokuString = (sudokuString: string, solutionSteps: SolutionStepInterface[]): string => {
    const chars = sudokuString.split('');

    for (const step of solutionSteps) {
        chars[step.cellIndex] = EMPTY_CELL;
    }

    return chars.join('');
};
