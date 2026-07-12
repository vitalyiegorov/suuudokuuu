import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { SolutionTechniqueEnum } from '@suuudokuuu/solver';

import { getCellKey } from '../../@generic/utils/get-cell-key.util';
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
        expect(getSudokuAtStep(gameState, 0).moveClassification).toBeNull();
    });

    it('should expose the step and calculate technique for the replayed move', () => {
        expect.assertions(2);

        const replayState = getSudokuAtStep(gameState, 1);

        expect(replayState.solutionStep).toEqual(logicalStep);
        expect(replayState.moveClassification).toEqual({ technique: SolutionTechniqueEnum.FullHouse, value: 9 });
    });

    it('should accumulate elapsed time and highlight through a multi-step replay', () => {
        expect.assertions(3);

        const multiStepSudoku = Sudoku.fromString(
            '.'.repeat(defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize),
            defaultSudokuConfig
        );
        const multiSteps = [0, 1, 2].map(cellIndex => ({
            cellIndex,
            value: multiStepSudoku.getCorrectValue(multiStepSudoku.Field[0][cellIndex]),
            ts: cellIndex + 5
        }));
        const multiStepGameState = {
            ...initialGameState,
            sudokuString: multiStepSudoku.toString(),
            challengeSteps: multiSteps
        };
        const replayState = getSudokuAtStep(multiStepGameState, 2);

        expect(replayState.elapsedTime).toBe(multiSteps[0].ts + multiSteps[1].ts);
        expect(replayState.highlightedCellKey).toBe(getCellKey({ x: 1, y: 0 }));
        expect(replayState.solutionStep).toEqual(multiSteps[1]);
    });

    it('should clamp out-of-bounds steps to the full replay without throwing', () => {
        expect.assertions(2);

        const replayState = getSudokuAtStep(gameState, 5);

        expect(replayState.solutionStep).toEqual(logicalStep);
        expect(replayState.sudoku.Field[0][8].value).toBe(9);
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

        expect(getSudokuAtStep(guessGameState, 1).moveClassification).toEqual({
            technique: SolutionTechniqueEnum.Guess,
            value: guessStep.value
        });
    });
});
