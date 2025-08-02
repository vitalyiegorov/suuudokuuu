import { ColorSchemaEnum } from '../enum/color-schema.enum';
import { ThemeEnum } from '../enum/theme.enum';
import { BWDarkTheme, BWLightTheme } from '../themes/bw.theme';
import { SafariDarkTheme, SafariLightTheme } from '../themes/safari.theme';

export const getTheme = (theme: ThemeEnum, colorShema: ColorSchemaEnum) => {
    const themesConfig: Record<ThemeEnum, Record<ColorSchemaEnum, typeof BWLightTheme>> = {
        [ThemeEnum.BlackAndWhite]: {
            [ColorSchemaEnum.Dark]: BWDarkTheme,
            [ColorSchemaEnum.Light]: BWLightTheme
        },
        [ThemeEnum.Colorful]: {
            [ColorSchemaEnum.Dark]: SafariDarkTheme,
            [ColorSchemaEnum.Light]: SafariLightTheme
        }
    };

    return themesConfig[theme][colorShema];
};
