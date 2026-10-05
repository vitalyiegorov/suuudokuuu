import { ColorSchemaEnum } from '@suuudokuuu/progress';
import { use } from 'react';

import { ScreenChromeProvider } from '@rnw-community/react-native-screen-chrome';

import { ThemeContext } from '../../../theme/context/theme.context';
import { AppScreenChromeConfig, AppScreenChromeWashAlpha } from '../../constants/screen-chrome-config.constant';
import { applyColorAlpha } from '../../utils/apply-color-alpha.util';

import type { ScreenChromeColorScheme } from '@rnw-community/react-native-screen-chrome';
import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
    readonly washAlpha?: number;
}

export const ScreenChromeThemeProvider = ({ children, washAlpha = AppScreenChromeWashAlpha }: Props) => {
    const { colorScheme, theme } = use(ThemeContext);

    const screenChromeColorScheme: ScreenChromeColorScheme = colorScheme === ColorSchemaEnum.Dark ? 'dark' : 'light';
    const screenChromeConfig = {
        ...AppScreenChromeConfig,
        colors: {
            [screenChromeColorScheme]: {
                solid: theme.colors.background,
                wash: applyColorAlpha(theme.colors.background, washAlpha)
            }
        }
    };

    return (
        <ScreenChromeProvider colorScheme={screenChromeColorScheme} config={screenChromeConfig} syncNativeScrollOffset>
            {children}
        </ScreenChromeProvider>
    );
};
