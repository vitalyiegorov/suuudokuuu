import { DifficultyEnum } from '@suuudokuuu/generator';

import type { ThemeInterface } from '@suuudokuuu/ui/theme';

export const difficultyComplexityRailOptionGetColor = (theme: ThemeInterface, difficulty: DifficultyEnum, isSelected: boolean): string => {
    if (isSelected && difficulty === DifficultyEnum.Hell) {
        return theme.colors.danger;
    }

    if (isSelected && difficulty === DifficultyEnum.Infinity) {
        return theme.colors.accent;
    }

    if (isSelected) {
        return theme.colors.text.primary;
    }

    return theme.colors.text.hint;
};
