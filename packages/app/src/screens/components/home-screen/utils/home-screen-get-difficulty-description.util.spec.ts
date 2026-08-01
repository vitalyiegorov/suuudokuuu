import { describe, expect, it } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { isNotEmptyString } from '@rnw-community/shared';

import { homeScreenGetDifficultyDescription } from './home-screen-get-difficulty-description.util';

describe('homeScreenGetDifficultyDescription', () => {
    it('should return a non-empty description for every difficulty', () => {
        Object.values(DifficultyEnum).forEach(difficulty => {
            expect(isNotEmptyString(homeScreenGetDifficultyDescription(difficulty))).toBe(true);
        });
    });

    it('should describe Hell by its minimal clue count', () => {
        expect(homeScreenGetDifficultyDescription(DifficultyEnum.Hell)).toBe('Minimum clues');
    });
});
