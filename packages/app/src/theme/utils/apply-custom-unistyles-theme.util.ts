import { ColorSchemaEnum } from '@suuudokuuu/progress';

import type { UnistylesThemeNameType, UnistylesThemesConstant } from '../constant/unistyles-themes.constant';
import type { CustomThemeType } from '@suuudokuuu/progress';

type UnistylesThemeType = (typeof UnistylesThemesConstant)['customLight'];

interface UnistylesUpdateRuntime {
    readonly updateTheme: (themeName: UnistylesThemeNameType, updater: (currentTheme: UnistylesThemeType) => UnistylesThemeType) => void;
}

export const applyCustomUnistylesTheme = (runtime: UnistylesUpdateRuntime, customTheme: CustomThemeType): void => {
    runtime.updateTheme('customLight', currentTheme => ({ ...currentTheme, colors: customTheme.colors[ColorSchemaEnum.Light] }));
    runtime.updateTheme('customDark', currentTheme => ({ ...currentTheme, colors: customTheme.colors[ColorSchemaEnum.Dark] }));
};
