import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { stringToGameState } from './string-to-game-state.util';

import type { SolutionStepInterface } from '@suuudokuuu/encoder';

const GRID_SIZE = defaultSudokuConfig.fieldSize;

interface ReplayState {
    sudoku: Sudoku;
    steps: SolutionStepInterface[];
    currentStep: number;
    totalSteps: number;
    elapsedTime: number;
}

export const createReplayState = (encodedState: string): ReplayState | null => {
    try {
        const gameState = stringToGameState(encodedState);
        const sudoku = Sudoku.fromString(gameState.sudokuString, defaultSudokuConfig);
        const steps = gameState.solutionSteps;

        return {
            sudoku,
            steps,
            currentStep: 0,
            totalSteps: steps.length,
            elapsedTime: 0
        };
    } catch {
        return null;
    }
};

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
