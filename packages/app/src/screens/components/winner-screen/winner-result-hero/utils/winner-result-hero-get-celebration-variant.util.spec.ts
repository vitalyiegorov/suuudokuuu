import { describe, expect, it } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { winnerResultHeroGetCelebrationVariant } from './winner-result-hero-get-celebration-variant.util';

describe('winnerResultHeroGetCelebrationVariant', () => {
    it('returns the infinity variant for the Infinity difficulty', () => {
        expect(winnerResultHeroGetCelebrationVariant(DifficultyEnum.Infinity)).toBe('infinity');
    });

    it('returns the hell variant for the Hell difficulty', () => {
        expect(winnerResultHeroGetCelebrationVariant(DifficultyEnum.Hell)).toBe('hell');
    });

    it('returns the default variant for every other difficulty', () => {
        expect(winnerResultHeroGetCelebrationVariant(DifficultyEnum.Newbie)).toBe('default');
        expect(winnerResultHeroGetCelebrationVariant(DifficultyEnum.Nightmare)).toBe('default');
    });
});
