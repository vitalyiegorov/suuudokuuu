/* eslint-disable lingui/no-unlocalized-strings */
import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { initialGameState } from '../store/game.state';

import { gameStateToString } from './game-state-to-string.util';

import type { GameState } from '../store/game.state';

describe('gameStateToString', () => {
    it('should encode a game state string', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromString('.'.repeat(defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize), defaultSudokuConfig);
        const gameState = {
            ...initialGameState,
            sudokuString: sudoku.toString(),
            solutionSteps: [{ cellIndex: 0, value: 1, ts: 5 }]
        };

        expect(gameStateToString(gameState, true).length).toBeGreaterThan(0);
    });

    it('should return an empty string when encoding fails', () => {
        expect.assertions(1);

        expect(gameStateToString(null as unknown as GameState)).toBe('');
    });
});
