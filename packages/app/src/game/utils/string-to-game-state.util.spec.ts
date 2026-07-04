/* eslint-disable @typescript-eslint/no-magic-numbers, lingui/no-unlocalized-strings */
import { describe, expect, it } from '@jest/globals';

import { initialGameState } from '../store/game.state';

import { gameStateToString } from './game-state-to-string.util';
import { stringToGameState } from './string-to-game-state.util';

import type { GameState } from '../store/game.state';
import type { SolutionStepInterface } from '@suuudokuuu/encoder';

const solvedBoard = '534678912672195348198342567859761423426853791713924856961537284287419635345286179';
const givensMask = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';

const buildSteps = (): SolutionStepInterface[] => {
    const steps: SolutionStepInterface[] = [];

    for (let cellIndex = 0; cellIndex < solvedBoard.length; cellIndex += 1) {
        if (givensMask.charAt(cellIndex) === '.') {
            steps.push({ cellIndex, value: parseInt(solvedBoard.charAt(cellIndex), 10), ts: 10 });
        }
    }

    return steps;
};

const buildGameState = (): GameState => ({
    ...initialGameState,
    sudokuString: solvedBoard,
    solutionSteps: buildSteps(),
    maxMistakes: 0
});

describe('stringToGameState', () => {
    it('should restore a challenge share with steps and elapsed time', () => {
        expect.assertions(4);

        const encoded = gameStateToString(buildGameState(), true);
        const restored = stringToGameState(encoded);

        expect(restored.sudokuString).toBe(givensMask);
        expect(restored.challengeSteps).toHaveLength(51);
        expect(restored.challengeTime).toBe(510);
        expect(restored.challengeState).toBe(encoded);
    });

    it('should restore a puzzle share without challenge data', () => {
        expect.assertions(3);

        const encoded = gameStateToString(buildGameState(), false);
        const restored = stringToGameState(encoded);

        expect(restored.sudokuString).toBe(givensMask);
        expect(restored.challengeSteps).toEqual([]);
        expect(restored.challengeState).toBe('');
    });

    it('should fall back to the initial state for an undecodable link', () => {
        expect.assertions(1);

        expect(stringToGameState('not-a-valid-share-link')).toEqual(initialGameState);
    });

    it('should fall back to the initial state for a truncated share link', () => {
        expect.assertions(1);

        const encoded = gameStateToString(buildGameState(), true);
        const truncated = encoded.slice(0, Math.floor(encoded.length / 3));

        expect(stringToGameState(truncated)).toEqual(initialGameState);
    });

    it('should fall back to the initial state for an empty link', () => {
        expect.assertions(1);

        expect(stringToGameState()).toEqual(initialGameState);
    });
});

describe('gameStateToString', () => {
    it('should produce a payload that survives URL encoding unchanged', () => {
        expect.assertions(1);

        const encoded = gameStateToString(buildGameState(), true);

        expect(encodeURIComponent(encoded)).toBe(encoded);
    });

    it('should return an empty string for an invalid game state', () => {
        expect.assertions(1);

        const invalidState = { ...buildGameState(), sudokuString: '123' };

        expect(gameStateToString(invalidState, true)).toBe('');
    });
});
