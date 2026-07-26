import { ColorSchemaEnum } from '../enum/color-schema.enum';
import { ThemeEnum } from '../enum/theme.enum';

import { getUnistylesThemeName } from './get-unistyles-theme-name.util';

import type { ColorSchemeName } from 'react-native';

export const getInitialUnistylesThemeName = (colorScheme: ColorSchemeName | null | undefined) =>
    getUnistylesThemeName(ThemeEnum.BlackAndWhite, colorScheme === 'dark' ? ColorSchemaEnum.Dark : ColorSchemaEnum.Light);
