import { describe, expect, it } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { getDifficultyText } from './get-difficulty-text.util';

describe('getDifficultyText', () => {
    it.each([
        [DifficultyEnum.Newbie, 'Newbie'],
        [DifficultyEnum.Easy, 'Easy'],
        [DifficultyEnum.Medium, 'Medium'],
        [DifficultyEnum.Hard, 'Hard'],
        [DifficultyEnum.Nightmare, 'Nightmare'],
        [DifficultyEnum.Hell, 'Hell']
    ])('should map %s to its label', (difficulty, expected) => {
        expect.assertions(1);

        expect(getDifficultyText(difficulty)).toBe(expected);
    });

    it('should fall back to the unknown label for an unrecognised difficulty', () => {
        expect.assertions(1);

        const unknownDifficulty = 'not-a-difficulty' as DifficultyEnum;

        expect(getDifficultyText(unknownDifficulty)).toBe('Unknown');
    });
});
