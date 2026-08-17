import { describe, expect, it } from '@jest/globals';
import { DifficultyEnum, Sudoku } from '@suuudokuuu/generator';
import { INFINITY_CORPUS_MINIMUM_RATING } from '@suuudokuuu/hell-corpus';

import { gameProviderCreateInfinityGame } from './game-provider-create-infinity-game.util';

const MinimumInfinityGivenCellCount = 21;
const MaximumInfinityGivenCellCount = 23;
const NextCallDelayMs = 5;

const getGivenCellCount = (sudoku: Sudoku): number =>
    sudoku
        .toString()
        .split('')
        .filter(character => character !== '.').length;

describe('gameProviderCreateInfinityGame', () => {
    it('should build a Sudoku instance from a curated world-record puzzle with its published rating', () => {
        const { sudoku, rating } = gameProviderCreateInfinityGame();
        const givenCellCount = getGivenCellCount(sudoku);

        expect(sudoku).toBeInstanceOf(Sudoku);
        expect(givenCellCount).toBeGreaterThanOrEqual(MinimumInfinityGivenCellCount);
        expect(givenCellCount).toBeLessThanOrEqual(MaximumInfinityGivenCellCount);
        expect(rating).toBeGreaterThanOrEqual(INFINITY_CORPUS_MINIMUM_RATING);
    });

    it('should not be identifiable as Infinity from blank-cell inference alone', () => {
        const { sudoku } = gameProviderCreateInfinityGame();

        expect([DifficultyEnum.Nightmare, DifficultyEnum.Hell]).toContain(sudoku.Difficulty);
    });

    it('should produce a different puzzle for a later call', async () => {
        const first = gameProviderCreateInfinityGame();

        await new Promise<void>(resolve => {
            setTimeout(resolve, NextCallDelayMs);
        });

        const second = gameProviderCreateInfinityGame();

        expect(first.sudoku.toString()).not.toBe(second.sudoku.toString());
    });
});
