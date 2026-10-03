import type { ThemeEnum } from '@suuudokuuu/progress';

export type CustomThemeIdType = `custom-${string}`;

export type ThemeIdType = CustomThemeIdType | ThemeEnum;
