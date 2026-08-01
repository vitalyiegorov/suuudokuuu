import { describe, expect, it } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { DifficultyComplexitySliderDifficulties, DifficultyComplexitySliderMaxIndex } from './difficulty-complexity-slider.constant';

describe('DifficultyComplexitySliderDifficulties', () => {
    it('should carry Hell as the sixth and final stop', () => {
        expect(DifficultyComplexitySliderDifficulties).toHaveLength(6);
        expect(DifficultyComplexitySliderDifficulties.at(-1)).toBe(DifficultyEnum.Hell);
    });

    it('should select Hell when the sixth stop index is committed', () => {
        expect(DifficultyComplexitySliderDifficulties[5]).toBe(DifficultyEnum.Hell);
        expect(DifficultyComplexitySliderMaxIndex).toBe(5);
    });
});
