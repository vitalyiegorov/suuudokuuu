import { ColorSchemaEnum } from '@suuudokuuu/progress';
import { use } from 'react';

import { ScreenChromeProvider } from '@rnw-community/react-native-screen-chrome';

import { ThemeContext } from '../../../theme/context/theme.context';
import { AppScreenChromeConfig, AppScreenChromeSolidAlpha } from '../../constants/screen-chrome-config.constant';
import { applyColorAlpha } from '../../utils/apply-color-alpha.util';

import { ScreenChromeWashAlphaContext } from './context/screen-chrome-wash-alpha.context';

import type { ScreenChromeColorScheme } from '@rnw-community/react-native-screen-chrome';
import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
    readonly washAlpha?: number;
}

export const ScreenChromeThemeProvider = ({ children, washAlpha }: Props) => {
    const { colorScheme, theme } = use(ThemeContext);
    const inheritedWashAlpha = use(ScreenChromeWashAlphaContext);

    const resolvedWashAlpha = washAlpha ?? inheritedWashAlpha;
    const screenChromeColorScheme: ScreenChromeColorScheme = colorScheme === ColorSchemaEnum.Dark ? 'dark' : 'light';
    const screenChromeConfig = {
        ...AppScreenChromeConfig,
        colors: {
            [screenChromeColorScheme]: {
                solid: applyColorAlpha(theme.colors.background, Math.max(AppScreenChromeSolidAlpha, resolvedWashAlpha)),
                wash: applyColorAlpha(theme.colors.background, resolvedWashAlpha)
            }
        }
    };

    return (
        <ScreenChromeProvider colorScheme={screenChromeColorScheme} config={screenChromeConfig} syncNativeScrollOffset>
            {children}
        </ScreenChromeProvider>
    );
};
