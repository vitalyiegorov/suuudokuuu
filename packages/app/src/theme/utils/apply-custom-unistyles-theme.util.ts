import { ColorSchemaEnum } from '../enum/color-schema.enum';

import type { UnistylesThemeNameType, UnistylesThemesConstant } from '../constant/unistyles-themes.constant';
import type { CustomThemeInterface } from '../interface/custom-theme.interface';

type UnistylesThemeType = (typeof UnistylesThemesConstant)['customLight'];

interface UnistylesUpdateRuntime {
    readonly updateTheme: (themeName: UnistylesThemeNameType, updater: (currentTheme: UnistylesThemeType) => UnistylesThemeType) => void;
}

export const applyCustomUnistylesTheme = (runtime: UnistylesUpdateRuntime, customTheme: CustomThemeInterface): void => {
    runtime.updateTheme('customLight', currentTheme => ({ ...currentTheme, colors: customTheme.colors[ColorSchemaEnum.Light] }));
    runtime.updateTheme('customDark', currentTheme => ({ ...currentTheme, colors: customTheme.colors[ColorSchemaEnum.Dark] }));
};
