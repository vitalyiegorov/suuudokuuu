import { describe, expect, it } from '@jest/globals';
import { DifficultyEnum, Sudoku } from '@suuudokuuu/generator';
import { HELL_CORPUS_MINIMUM_RATING } from '@suuudokuuu/hell-corpus';

import { gameProviderCreateHellGame } from './game-provider-create-hell-game.util';

const HellPuzzleGivenCellCount = 17;
const NextCallDelayMs = 5;

describe('gameProviderCreateHellGame', () => {
    it('should build a Sudoku instance from a genuine 17-clue Hell puzzle with its verified rating', () => {
        const { sudoku, rating } = gameProviderCreateHellGame();
        const givenCellCount = sudoku
            .toString()
            .split('')
            .filter(character => character !== '.').length;

        expect(sudoku).toBeInstanceOf(Sudoku);
        expect(sudoku.Difficulty).toBe(DifficultyEnum.Hell);
        expect(givenCellCount).toBe(HellPuzzleGivenCellCount);
        expect(rating).toBeGreaterThanOrEqual(HELL_CORPUS_MINIMUM_RATING);
    });

    it('should produce a different puzzle for a later call', async () => {
        const first = gameProviderCreateHellGame();

        await new Promise<void>(resolve => {
            setTimeout(resolve, NextCallDelayMs);
        });

        const second = gameProviderCreateHellGame();

        expect(first.sudoku.toString()).not.toBe(second.sudoku.toString());
    });
});
