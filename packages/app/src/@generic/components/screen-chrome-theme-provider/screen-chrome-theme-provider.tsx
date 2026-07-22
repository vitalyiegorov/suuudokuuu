import { ColorSchemeEnum as ScreenChromeColorSchemeEnum, ScreenChromeProvider } from '@suuudokuuu/screen-chrome';
import { use } from 'react';

import { ThemeContext } from '../../../theme/context/theme.context';
import { ColorSchemaEnum } from '../../../theme/enum/color-schema.enum';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

const screenChromeConfig = {
    intensity: 60,
    maxBlurIntensity: 72,
    topFadeHeight: 128,
    headerBackdropHeight: 240,
    colors: {
        [ScreenChromeColorSchemeEnum.LIGHT]: { solid: 'rgba(242,242,240,0.35)', wash: 'rgba(242,242,240,0)' },
        [ScreenChromeColorSchemeEnum.DARK]: { solid: 'rgba(12,12,13,0.32)', wash: 'rgba(12,12,13,0)' }
    }
};

export const ScreenChromeThemeProvider = ({ children }: Props) => {
    const { colorScheme } = use(ThemeContext);

    const screenChromeColorScheme =
        colorScheme === ColorSchemaEnum.Dark ? ScreenChromeColorSchemeEnum.DARK : ScreenChromeColorSchemeEnum.LIGHT;

    return (
        <ScreenChromeProvider colorScheme={screenChromeColorScheme} config={screenChromeConfig}>
            {children}
        </ScreenChromeProvider>
    );
};
