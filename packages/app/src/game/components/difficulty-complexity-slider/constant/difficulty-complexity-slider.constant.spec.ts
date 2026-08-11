import { describe, expect, it } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { DifficultyComplexitySliderDifficulties, DifficultyComplexitySliderMaxIndex } from './difficulty-complexity-slider.constant';

describe('DifficultyComplexitySliderDifficulties', () => {
    it('should carry Infinity as the seventh and final stop', () => {
        expect(DifficultyComplexitySliderDifficulties).toHaveLength(7);
        expect(DifficultyComplexitySliderDifficulties.at(-1)).toBe(DifficultyEnum.Infinity);
    });

    it('should select Infinity when the seventh stop index is committed', () => {
        expect(DifficultyComplexitySliderDifficulties[6]).toBe(DifficultyEnum.Infinity);
        expect(DifficultyComplexitySliderMaxIndex).toBe(6);
    });
});
