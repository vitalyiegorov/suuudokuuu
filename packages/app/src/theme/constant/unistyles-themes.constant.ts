import { BWDarkTheme, BWLightTheme } from '../themes/bw.theme';
import { ColorfulDarkTheme, ColorfulLightTheme } from '../themes/colorful.theme';
import { NewspaperDarkTheme, NewspaperLightTheme } from '../themes/newspaper';

import { UnistylesSharedTokensConstant } from './unistyles-shared-tokens.constant';

export const UnistylesThemesConstant = {
    bwLight: { colors: BWLightTheme.colors, ...UnistylesSharedTokensConstant },
    bwDark: { colors: BWDarkTheme.colors, ...UnistylesSharedTokensConstant },
    colorfulLight: { colors: ColorfulLightTheme.colors, ...UnistylesSharedTokensConstant },
    colorfulDark: { colors: ColorfulDarkTheme.colors, ...UnistylesSharedTokensConstant },
    newspaperLight: { colors: NewspaperLightTheme.colors, ...UnistylesSharedTokensConstant },
    newspaperDark: { colors: NewspaperDarkTheme.colors, ...UnistylesSharedTokensConstant }
};

export type UnistylesThemeNameType = keyof typeof UnistylesThemesConstant;
