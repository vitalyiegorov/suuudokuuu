import { describe, expect, it } from '@jest/globals';
import { GameStateSerializer } from '@suuudokuuu/encoder';
import { DifficultyEnum, Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { getChallengeDifficulty } from './get-challenge-difficulty.util';

const givens = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';
const StandardMaxMistakes = 3;

describe('getChallengeDifficulty', () => {
    const serializer = new GameStateSerializer();

    it('should read the difficulty from an encoded challenge state', () => {
        expect.assertions(1);

        const challengeState = serializer.encode(givens, [], StandardMaxMistakes, true);
        const expectedDifficulty = Sudoku.fromString(givens, defaultSudokuConfig).Difficulty;

        expect(getChallengeDifficulty(challengeState)).toBe(expectedDifficulty);
    });

    it('should fall back to the easiest difficulty for an empty state', () => {
        expect.assertions(1);

        expect(getChallengeDifficulty('')).toBe(DifficultyEnum.Newbie);
    });

    it('should fall back to the easiest difficulty for an undecodable state', () => {
        expect.assertions(1);

        expect(getChallengeDifficulty('not-a-valid-payload')).toBe(DifficultyEnum.Newbie);
    });
});
