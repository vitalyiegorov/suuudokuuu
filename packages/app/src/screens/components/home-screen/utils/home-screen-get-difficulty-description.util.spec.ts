import { describe, expect, it } from '@jest/globals';
import { i18n } from '@lingui/core';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { isNotEmptyString } from '@rnw-community/shared';

import { homeScreenGetDifficultyDescription } from './home-screen-get-difficulty-description.util';

describe('homeScreenGetDifficultyDescription', () => {
    it('should return a non-empty description for every difficulty', () => {
        Object.values(DifficultyEnum).forEach(difficulty => {
            expect(isNotEmptyString(i18n._(homeScreenGetDifficultyDescription(difficulty)))).toBe(true);
        });
    });

    it('should describe Hell by its minimal clue count', () => {
        expect(i18n._(homeScreenGetDifficultyDescription(DifficultyEnum.Hell))).toBe('Minimum clues');
    });

    it('should describe Infinity by its world-record corpus', () => {
        expect(i18n._(homeScreenGetDifficultyDescription(DifficultyEnum.Infinity))).toBe('World-record puzzles');
    });
});
