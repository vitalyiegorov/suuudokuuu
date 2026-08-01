import { describe, expect, it } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { BWLightTheme } from '../../../../../theme/themes/bw.theme';

import { difficultyComplexityRailOptionGetColor } from './difficulty-complexity-rail-option-get-color.util';

describe('difficultyComplexityRailOptionGetColor', () => {
    it('should render the selected Hell stop in the danger color', () => {
        const color = difficultyComplexityRailOptionGetColor(BWLightTheme, DifficultyEnum.Hell, true);

        expect(color).toBe(BWLightTheme.colors.danger);
    });

    it('should render other selected stops in the primary text color', () => {
        const color = difficultyComplexityRailOptionGetColor(BWLightTheme, DifficultyEnum.Nightmare, true);

        expect(color).toBe(BWLightTheme.colors.text.primary);
    });

    it('should render an unselected Hell stop in the hint text color', () => {
        const color = difficultyComplexityRailOptionGetColor(BWLightTheme, DifficultyEnum.Hell, false);

        expect(color).toBe(BWLightTheme.colors.text.hint);
    });
});
