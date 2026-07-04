/* eslint-disable lingui/no-unlocalized-strings */
import { describe, expect, it } from '@jest/globals';
import { SolutionTechniqueEnum, Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { initialGameState } from '../../game/store/game.state';

import { getSudokuAtStep } from './get-sudoku-at-step.util';

describe('getSudokuAtStep', () => {
    const sudoku = Sudoku.fromStrings(
        defaultSudokuConfig,
        '12345678.',
        '.........',
        '.........',
        '.........',
        '.........',
        '.........',
        '.........',
        '.........',
        '.........'
    );
    const logicalStep = { cellIndex: 8, value: 9, ts: 5 };
    const gameState = {
        ...initialGameState,
        sudokuString: sudoku.toString(),
        challengeSteps: [logicalStep]
    };

    it('should expose no solution step before replaying the first move', () => {
        expect.assertions(2);

        expect(getSudokuAtStep(gameState, 0).solutionStep).toBeNull();
        expect(getSudokuAtStep(gameState, 0).techniqueResult).toBeNull();
    });

    it('should expose the step and calculate technique for the replayed move', () => {
        expect.assertions(2);

        const replayState = getSudokuAtStep(gameState, 1);

        expect(replayState.solutionStep).toEqual(logicalStep);
        expect(replayState.techniqueResult?.technique).toBe(SolutionTechniqueEnum.FullHouse);
    });

    it('should calculate guess technique for unsupported moves', () => {
        expect.assertions(1);

        const guessSudoku = Sudoku.fromString(
            '.'.repeat(defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize),
            defaultSudokuConfig
        );
        const [[guessCell]] = guessSudoku.Field;
        const guessStep = { cellIndex: 0, value: guessSudoku.getCorrectValue(guessCell), ts: 5 };
        const guessGameState = {
            ...initialGameState,
            sudokuString: guessSudoku.toString(),
            challengeSteps: [guessStep]
        };

        expect(getSudokuAtStep(guessGameState, 1).techniqueResult?.technique).toBe(SolutionTechniqueEnum.Guess);
    });
});
