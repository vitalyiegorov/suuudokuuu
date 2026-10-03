import { ColorSchemaEnum } from '@suuudokuuu/progress';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from 'expo-router';
import { useEffect } from 'react';
import { Appearance, Platform } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';

import { isDefined } from '@rnw-community/shared';

import { useSettings } from '../../../settings/query/use-settings.query';
import { updateSettings } from '../../../settings/utils/update-settings.util';
import { ThemeContext } from '../../context/theme.context';
import { useCustomThemes } from '../../query/use-custom-themes.query';
import { isCustomThemeId } from '../../type-guard/is-custom-theme-id.type-guard';
import { applyCustomUnistylesTheme } from '../../utils/apply-custom-unistyles-theme.util';
import { getUnistylesThemeName } from '../../utils/get-unistyles-theme-name.util';
import { resolveTheme } from '../../utils/resolve-theme.util';
import { synchronizeUnistylesTheme } from '../../utils/synchronize-unistyles-theme.util';

import type { SettingsType } from '@suuudokuuu/progress';
import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

export const ThemeProvider = ({ children }: Props) => {
    const { isDarkColorSchema, theme: selectedTheme } = useSettings();
    const customThemes = useCustomThemes();

    const colorScheme = isDarkColorSchema ? ColorSchemaEnum.Dark : ColorSchemaEnum.Light;
    const unistylesThemeName = getUnistylesThemeName(selectedTheme, colorScheme);
    const activeCustomTheme = customThemes.find(theme => isCustomThemeId(selectedTheme) && theme.id === selectedTheme);

    useEffect(() => {
        if (isDefined(activeCustomTheme)) {
            applyCustomUnistylesTheme(UnistylesRuntime, activeCustomTheme);
        }

        synchronizeUnistylesTheme(UnistylesRuntime, unistylesThemeName);
    }, [activeCustomTheme, unistylesThemeName]);
    useEffect(() => {
        if (Platform.OS === 'web') {
            document.documentElement.style.colorScheme = colorScheme;

            return;
        }

        Appearance.setColorScheme(colorScheme);
    }, [colorScheme]);

    const changeTheme = (theme: SettingsType['theme']) => {
        void updateSettings({ theme });
    };

    const theme = resolveTheme(selectedTheme, colorScheme, customThemes);
    const navigationTheme = colorScheme === ColorSchemaEnum.Light ? DefaultTheme : DarkTheme;
    const fullNavigationTheme = {
        ...navigationTheme,
        colors: {
            ...navigationTheme.colors,
            background: theme.colors.background
        }
    };
    const value = { changeTheme, colorScheme, theme };

    return (
        <ThemeContext value={value}>
            <NavigationThemeProvider value={fullNavigationTheme}>{children}</NavigationThemeProvider>
        </ThemeContext>
    );
};
