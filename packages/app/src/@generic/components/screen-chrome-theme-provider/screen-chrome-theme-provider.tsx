import { ColorSchemeEnum as ScreenChromeColorSchemeEnum, ScreenChromeProvider } from '@suuudokuuu/screen-chrome';
import { use } from 'react';

import { ThemeContext } from '../../../theme/context/theme.context';
import { ColorSchemaEnum } from '../../../theme/enum/color-schema.enum';
import { AppScreenChromeConfig, AppScreenChromeSolidAlpha, AppScreenChromeWashAlpha } from '../../constants/screen-chrome-config.constant';
import { applyColorAlpha } from '../../utils/apply-color-alpha.util';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

export const ScreenChromeThemeProvider = ({ children }: Props) => {
    const { colorScheme, theme } = use(ThemeContext);

    const screenChromeColorScheme =
        colorScheme === ColorSchemaEnum.Dark ? ScreenChromeColorSchemeEnum.DARK : ScreenChromeColorSchemeEnum.LIGHT;
    const screenChromeColors = {
        solid: applyColorAlpha(theme.colors.background, AppScreenChromeSolidAlpha),
        wash: applyColorAlpha(theme.colors.background, AppScreenChromeWashAlpha)
    };
    const screenChromeConfig = {
        ...AppScreenChromeConfig,
        colors: {
            [ScreenChromeColorSchemeEnum.LIGHT]: screenChromeColors,
            [ScreenChromeColorSchemeEnum.DARK]: screenChromeColors
        }
    };

    return (
        <ScreenChromeProvider colorScheme={screenChromeColorScheme} config={screenChromeConfig}>
            {children}
        </ScreenChromeProvider>
    );
};
