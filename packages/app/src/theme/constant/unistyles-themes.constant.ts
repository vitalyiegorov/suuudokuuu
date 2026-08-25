import { BWDarkTheme, BWLightTheme } from '../themes/bw.theme';
import { ColorblindSafeDarkTheme, ColorblindSafeLightTheme } from '../themes/colorblind-safe.theme';
import { ColorfulDarkTheme, ColorfulLightTheme } from '../themes/colorful.theme';
import { HighContrastDarkTheme, HighContrastLightTheme } from '../themes/high-contrast.theme';
import { NewspaperDarkTheme, NewspaperLightTheme } from '../themes/newspaper';

import { UnistylesSharedTokensConstant } from './unistyles-shared-tokens.constant';

export const UnistylesThemesConstant = {
    bwLight: { colors: BWLightTheme.colors, ...UnistylesSharedTokensConstant },
    bwDark: { colors: BWDarkTheme.colors, ...UnistylesSharedTokensConstant },
    colorfulLight: { colors: ColorfulLightTheme.colors, ...UnistylesSharedTokensConstant },
    colorfulDark: { colors: ColorfulDarkTheme.colors, ...UnistylesSharedTokensConstant },
    newspaperLight: { colors: NewspaperLightTheme.colors, ...UnistylesSharedTokensConstant },
    newspaperDark: { colors: NewspaperDarkTheme.colors, ...UnistylesSharedTokensConstant },
    highContrastLight: { colors: HighContrastLightTheme.colors, ...UnistylesSharedTokensConstant },
    highContrastDark: { colors: HighContrastDarkTheme.colors, ...UnistylesSharedTokensConstant },
    colorblindSafeLight: { colors: ColorblindSafeLightTheme.colors, ...UnistylesSharedTokensConstant },
    colorblindSafeDark: { colors: ColorblindSafeDarkTheme.colors, ...UnistylesSharedTokensConstant },
    customLight: { colors: BWLightTheme.colors, ...UnistylesSharedTokensConstant },
    customDark: { colors: BWDarkTheme.colors, ...UnistylesSharedTokensConstant }
};

export type UnistylesThemeNameType = keyof typeof UnistylesThemesConstant;
