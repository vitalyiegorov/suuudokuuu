import { describe, expect, it } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { getDifficultyMessage } from './get-difficulty-message.util';

describe('getDifficultyMessage', () => {
    it.each([
        [DifficultyEnum.Newbie, 'Newbie'],
        [DifficultyEnum.Easy, 'Easy'],
        [DifficultyEnum.Medium, 'Medium'],
        [DifficultyEnum.Hard, 'Hard'],
        [DifficultyEnum.Nightmare, 'Nightmare'],
        [DifficultyEnum.Hell, 'Hell'],
        [DifficultyEnum.Infinity, 'Infinity']
    ])('should map %s to its message descriptor', (difficulty, expectedMessage) => {
        expect.assertions(1);

        expect(getDifficultyMessage(difficulty).message).toBe(expectedMessage);
    });

    it('should fall back to the unknown descriptor for an unrecognised difficulty', () => {
        expect.assertions(1);

        const unknownDifficulty = 'not-a-difficulty' as DifficultyEnum;

        expect(getDifficultyMessage(unknownDifficulty).message).toBe('Unknown');
    });
});
