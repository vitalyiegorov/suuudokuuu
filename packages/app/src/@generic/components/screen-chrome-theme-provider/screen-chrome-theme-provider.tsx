import { ColorSchemeEnum as ScreenChromeColorSchemeEnum, ScreenChromeProvider } from '@suuudokuuu/screen-chrome';
import { use } from 'react';

import { ThemeContext } from '../../../theme/context/theme.context';
import { ColorSchemaEnum } from '../../../theme/enum/color-schema.enum';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

export const ScreenChromeThemeProvider = ({ children }: Props) => {
    const { colorScheme } = use(ThemeContext);

    const screenChromeColorScheme =
        colorScheme === ColorSchemaEnum.Dark ? ScreenChromeColorSchemeEnum.DARK : ScreenChromeColorSchemeEnum.LIGHT;

    return <ScreenChromeProvider colorScheme={screenChromeColorScheme}>{children}</ScreenChromeProvider>;
};
