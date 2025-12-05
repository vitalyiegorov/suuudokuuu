import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import type { SolutionStepInterface } from '@suuudokuuu/encoder';

const GRID_SIZE = defaultSudokuConfig.fieldSize;

export const applySolutionStep = (sudoku: Sudoku, step: SolutionStepInterface): void => {
    const x = step.cellIndex % GRID_SIZE;
    const y = Math.floor(step.cellIndex / GRID_SIZE);
    const cell = sudoku.Field[y][x];

    sudoku.setCellValue({ ...cell, value: step.value });
};

export const createSudokuAtStep = (originalSudokuString: string, steps: SolutionStepInterface[], targetStep: number): Sudoku => {
    const sudoku = Sudoku.fromString(originalSudokuString, defaultSudokuConfig);

    for (let i = 0; i < targetStep && i < steps.length; i += 1) {
        applySolutionStep(sudoku, steps[i]);
    }

    return sudoku;
};

export const getElapsedTimeAtStep = (steps: SolutionStepInterface[], targetStep: number): number => {
    let elapsedTime = 0;

    for (let i = 0; i < targetStep && i < steps.length; i += 1) {
        elapsedTime += steps[i].ts;
    }

    return elapsedTime;
};
