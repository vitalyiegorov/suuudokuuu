import { beforeEach, describe, expect, it, jest } from '@jest/globals';

const mockEncodedState = 'encoded-state';
const mockEncodeCalls: unknown[][] = [];
let mockShouldThrow = false;

jest.mock('@suuudokuuu/encoder', () => ({
    GameStateSerializer: jest.fn(() => ({
        encode: (...params: unknown[]) => {
            mockEncodeCalls.push(params);

            if (mockShouldThrow) {
                throw new Error('Encode failed');
            }

            return mockEncodedState;
        }
    }))
}));

import { initialGameState } from '../store/game.state';

import { gameStateToString } from './game-state-to-string.util';

const StartedSudokuString = 'started-sudoku';

describe('gameStateToString', () => {
    beforeEach(() => {
        mockEncodeCalls.length = 0;
        mockShouldThrow = false;
    });

    it('encodes active game state with challenge metadata', () => {
        const gameState = {
            ...initialGameState,
            maxMistakes: 0,
            sudokuString: StartedSudokuString
        };

        expect(gameStateToString(gameState, true)).toBe(mockEncodedState);
        expect(mockEncodeCalls).toEqual([[StartedSudokuString, [], 0, true]]);
    });

    it('returns an empty string when encoding fails', () => {
        mockShouldThrow = true;

        expect(gameStateToString(initialGameState)).toBe('');
    });
});
