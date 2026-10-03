import { ColorSchemaEnum, ThemeEnum } from '@suuudokuuu/progress';

import { getUnistylesThemeName } from './get-unistyles-theme-name.util';

import type { ColorSchemeName } from 'react-native';

export const getInitialUnistylesThemeName = (colorScheme: ColorSchemeName | null | undefined) =>
    getUnistylesThemeName(ThemeEnum.BlackAndWhite, colorScheme === 'dark' ? ColorSchemaEnum.Dark : ColorSchemaEnum.Light);
