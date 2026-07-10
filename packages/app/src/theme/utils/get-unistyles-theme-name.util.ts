import { ColorSchemaEnum } from '../enum/color-schema.enum';
import { ThemeEnum } from '../enum/theme.enum';

import type { UnistylesThemeNameType } from '../constant/unistyles-themes.constant';

const unistylesThemeNamesByThemeAndSchema: Record<ThemeEnum, Record<ColorSchemaEnum, UnistylesThemeNameType>> = {
    [ThemeEnum.BlackAndWhite]: {
        [ColorSchemaEnum.Light]: 'bwLight',
        [ColorSchemaEnum.Dark]: 'bwDark'
    },
    [ThemeEnum.Colorful]: {
        [ColorSchemaEnum.Light]: 'colorfulLight',
        [ColorSchemaEnum.Dark]: 'colorfulDark'
    },
    [ThemeEnum.Newspaper]: {
        [ColorSchemaEnum.Light]: 'newspaperLight',
        [ColorSchemaEnum.Dark]: 'newspaperDark'
    }
};

export const getUnistylesThemeName = (theme: ThemeEnum, colorSchema: ColorSchemaEnum): UnistylesThemeNameType =>
    unistylesThemeNamesByThemeAndSchema[theme][colorSchema];
