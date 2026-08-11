import { ColorSchemaEnum } from '../enum/color-schema.enum';
import { ThemeEnum } from '../enum/theme.enum';
import { isCustomThemeId } from '../type-guard/is-custom-theme-id.type-guard';

import type { UnistylesThemeNameType } from '../constant/unistyles-themes.constant';
import type { ThemeIdType } from '../types/theme-id.type';

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
    },
    [ThemeEnum.HighContrast]: {
        [ColorSchemaEnum.Light]: 'highContrastLight',
        [ColorSchemaEnum.Dark]: 'highContrastDark'
    },
    [ThemeEnum.ColorblindSafe]: {
        [ColorSchemaEnum.Light]: 'colorblindSafeLight',
        [ColorSchemaEnum.Dark]: 'colorblindSafeDark'
    }
};

export const getUnistylesThemeName = (themeId: ThemeIdType, colorSchema: ColorSchemaEnum): UnistylesThemeNameType => {
    if (isCustomThemeId(themeId)) {
        return colorSchema === ColorSchemaEnum.Dark ? 'customDark' : 'customLight';
    }

    return unistylesThemeNamesByThemeAndSchema[themeId][colorSchema];
};
