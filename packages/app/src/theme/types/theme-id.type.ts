import type { ThemeEnum } from '../enum/theme.enum';

export type CustomThemeIdType = `custom-${string}`;

export type ThemeIdType = CustomThemeIdType | ThemeEnum;
