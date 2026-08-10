import { describe, expect, it } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { getDifficultyFromOrdinal } from './get-difficulty-from-ordinal.util';

describe('getDifficultyFromOrdinal', () => {
    it.each([
        [1, DifficultyEnum.Newbie],
        [2, DifficultyEnum.Easy],
        [3, DifficultyEnum.Medium],
        [4, DifficultyEnum.Hard],
        [5, DifficultyEnum.Nightmare],
        [6, DifficultyEnum.Hell],
        [7, DifficultyEnum.Infinity]
    ])('should map ordinal %i to %s', (ordinal, expected) => {
        expect.assertions(1);

        expect(getDifficultyFromOrdinal(ordinal)).toBe(expected);
    });

    it('should return null for the unknown sentinel ordinal', () => {
        expect.assertions(1);

        expect(getDifficultyFromOrdinal(0)).toBeNull();
    });

    it('should return null for an ordinal beyond the known difficulties', () => {
        expect.assertions(1);

        expect(getDifficultyFromOrdinal(8)).toBeNull();
    });
});
