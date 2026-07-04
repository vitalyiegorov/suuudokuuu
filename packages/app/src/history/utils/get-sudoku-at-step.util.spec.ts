/* eslint-disable lingui/no-unlocalized-strings */
import { describe, expect, it } from '@jest/globals';
import { SolutionTechniqueEnum, Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { initialGameState } from '../../game/store/game.state';

import { getSudokuAtStep } from './get-sudoku-at-step.util';

describe('getSudokuAtStep', () => {
    const sudoku = Sudoku.fromString('.'.repeat(defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize), defaultSudokuConfig);
    const firstGuessStep = { cellIndex: 0, value: 1, ts: 5, technique: SolutionTechniqueEnum.Guess, isGuessLike: true };
    const secondLogicalStep = {
        cellIndex: 1,
        value: 2,
        ts: 7,
        technique: SolutionTechniqueEnum.HiddenSingle,
        isGuessLike: false
    };
    const gameState = {
        ...initialGameState,
        sudokuString: sudoku.toString(),
        challengeSteps: [firstGuessStep, secondLogicalStep]
    };

    it('should expose no solution step before replaying the first move', () => {
        expect.assertions(1);

        expect(getSudokuAtStep(gameState, 0).solutionStep).toBeNull();
    });

    it('should expose the solution step metadata for the replayed move', () => {
        expect.assertions(2);

        expect(getSudokuAtStep(gameState, 1).solutionStep).toEqual(firstGuessStep);
        expect(getSudokuAtStep(gameState, 2).solutionStep).toEqual(secondLogicalStep);
    });
});
