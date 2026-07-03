/* eslint-disable lingui/no-unlocalized-strings */
import { describe, expect, it } from '@jest/globals';
import { SolutionTechniqueEnum, Sudoku, TechniqueManager, defaultSudokuConfig, emptyScoredCells } from '@suuudokuuu/generator';

import { gameSlice } from './game.slice';
import { initialGameState } from './game.state';

describe('gameSlice', () => {
    it('should store solution technique metadata when saving a move', () => {
        expect.assertions(1);

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
        const correctCell = { ...sudoku.Field[0][8], value: 9 };
        const techniqueResult = new TechniqueManager(sudoku).identifyMove(correctCell);
        const state = { ...initialGameState, elapsedTime: 12 };

        const nextState = gameSlice.reducer(
            state,
            gameSlice.actions.save({ sudoku, correctCell, scoredCells: emptyScoredCells, techniqueResult })
        );

        expect(nextState.solutionSteps).toEqual([
            {
                cellIndex: 8,
                value: 9,
                ts: 12,
                technique: SolutionTechniqueEnum.FullHouse,
                isGuessLike: false
            }
        ]);
    });
});
