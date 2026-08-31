import { use } from 'react';

import { ScreenChromeProvider } from '@rnw-community/react-native-screen-chrome';

import { ThemeContext } from '../../../theme/context/theme.context';
import { ColorSchemaEnum } from '../../../theme/enum/color-schema.enum';
import { AppScreenChromeConfig, AppScreenChromeSolidAlpha, AppScreenChromeWashAlpha } from '../../constants/screen-chrome-config.constant';
import { applyColorAlpha } from '../../utils/apply-color-alpha.util';

import type { ScreenChromeColorScheme } from '@rnw-community/react-native-screen-chrome';
import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

export const ScreenChromeThemeProvider = ({ children }: Props) => {
    const { colorScheme, theme } = use(ThemeContext);

    const screenChromeColorScheme: ScreenChromeColorScheme = colorScheme === ColorSchemaEnum.Dark ? 'dark' : 'light';
    const screenChromeColors = {
        solid: applyColorAlpha(theme.colors.background, AppScreenChromeSolidAlpha),
        wash: applyColorAlpha(theme.colors.background, AppScreenChromeWashAlpha)
    };
    const screenChromeConfig = {
        ...AppScreenChromeConfig,
        colors: {
            light: screenChromeColors,
            dark: screenChromeColors
        }
    };

    return (
        <ScreenChromeProvider colorScheme={screenChromeColorScheme} config={screenChromeConfig} syncNativeScrollOffset>
            {children}
        </ScreenChromeProvider>
    );
};
