/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it } from '@jest/globals';
import { DIFFICULTY_CODE_MAX, DIFFICULTY_CODE_UNKNOWN } from '@suuudokuuu/encoder';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { difficultyCodeToDifficulty } from './difficulty-code-to-difficulty.util';
import { difficultyToDifficultyCode } from './difficulty-to-difficulty-code.util';

describe('difficultyCodeToDifficulty', () => {
    it.each([
        [0, DifficultyEnum.Newbie],
        [1, DifficultyEnum.Easy],
        [2, DifficultyEnum.Medium],
        [3, DifficultyEnum.Hard],
        [4, DifficultyEnum.Nightmare],
        [5, DifficultyEnum.Hell],
        [6, DifficultyEnum.Infinity]
    ])('should map the code %s to %s', (code, difficulty) => {
        expect.assertions(1);

        expect(difficultyCodeToDifficulty(code)).toBe(difficulty);
    });

    it.each([null, -1, 7, 8, 1.5, NaN])('should report no difficulty for the code %s', code => {
        expect.assertions(1);

        expect(difficultyCodeToDifficulty(code)).toBeNull();
    });

    it('should round-trip every difficulty through its code', () => {
        expect.assertions(Object.values(DifficultyEnum).length);

        for (const difficulty of Object.values(DifficultyEnum)) {
            expect(difficultyCodeToDifficulty(difficultyToDifficultyCode(difficulty))).toBe(difficulty);
        }
    });
});

describe('difficulty code wire contract', () => {
    it('should keep every difficulty inside the range the encoder can represent', () => {
        expect.assertions(2);

        const highestDifficultyCode = Object.values(DifficultyEnum).length - 1;

        expect(highestDifficultyCode).toBeLessThanOrEqual(DIFFICULTY_CODE_MAX);
        expect(DIFFICULTY_CODE_MAX).toBeLessThan(DIFFICULTY_CODE_UNKNOWN);
    });
});

describe('difficultyToDifficultyCode', () => {
    it.each([
        [DifficultyEnum.Newbie, 0],
        [DifficultyEnum.Easy, 1],
        [DifficultyEnum.Medium, 2],
        [DifficultyEnum.Hard, 3],
        [DifficultyEnum.Nightmare, 4],
        [DifficultyEnum.Hell, 5],
        [DifficultyEnum.Infinity, 6]
    ])('should map %s to the code %s', (difficulty, code) => {
        expect.assertions(1);

        expect(difficultyToDifficultyCode(difficulty)).toBe(code);
    });
});
