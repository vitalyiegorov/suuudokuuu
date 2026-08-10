import { describe, expect, it } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { getDifficultyOrdinal } from './get-difficulty-ordinal.util';

describe('getDifficultyOrdinal', () => {
    it.each([
        [DifficultyEnum.Newbie, 1],
        [DifficultyEnum.Easy, 2],
        [DifficultyEnum.Medium, 3],
        [DifficultyEnum.Hard, 4],
        [DifficultyEnum.Nightmare, 5],
        [DifficultyEnum.Hell, 6],
        [DifficultyEnum.Infinity, 7]
    ])('should map %s to ordinal %i', (difficulty, expected) => {
        expect.assertions(1);

        expect(getDifficultyOrdinal(difficulty)).toBe(expected);
    });
});
