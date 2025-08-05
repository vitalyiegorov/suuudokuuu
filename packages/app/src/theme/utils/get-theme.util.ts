import { ColorSchemaEnum } from '../enum/color-schema.enum';
import { ThemeEnum } from '../enum/theme.enum';
import { BWDarkTheme, BWLightTheme } from '../themes/bw.theme';
import { ColorfulDarkTheme, ColorfulLightTheme } from '../themes/colorful.theme';
import { NewspaperDarkTheme, NewspaperLightTheme } from '../themes/newspaper';

export const getTheme = (theme: ThemeEnum, colorShema: ColorSchemaEnum) => {
    const themesConfig: Record<ThemeEnum, Record<ColorSchemaEnum, typeof BWLightTheme>> = {
        [ThemeEnum.BlackAndWhite]: {
            [ColorSchemaEnum.Dark]: BWDarkTheme,
            [ColorSchemaEnum.Light]: BWLightTheme
        },
        [ThemeEnum.Colorful]: {
            [ColorSchemaEnum.Dark]: ColorfulDarkTheme,
            [ColorSchemaEnum.Light]: ColorfulLightTheme
        },
        [ThemeEnum.Newspaper]: {
            [ColorSchemaEnum.Dark]: NewspaperDarkTheme,
            [ColorSchemaEnum.Light]: NewspaperLightTheme
        }
    };

    return themesConfig[theme][colorShema];
};
