import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from 'expo-router';
import { useLayoutEffect } from 'react';
import { Appearance, Platform } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';

import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { settingsSetAction } from '../../../settings/store/settings.actions';
import { settingsKeySelector, settingsThemeSelector } from '../../../settings/store/settings.selectors';
import { ThemeContext } from '../../context/theme.context';
import { ColorSchemaEnum } from '../../enum/color-schema.enum';
import { getTheme } from '../../utils/get-theme.util';
import { getUnistylesThemeName } from '../../utils/get-unistyles-theme-name.util';

import type { SettingsState } from '../../../settings/store/settings.state';
import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

export const ThemeProvider = ({ children }: Props) => {
    const dispatch = useAppDispatch();
    const selectedTheme = useAppSelector(settingsThemeSelector);
    const isDarkColorSchema = useAppSelector(settingsKeySelector('isDarkColorSchema'));

    const colorScheme = isDarkColorSchema ? ColorSchemaEnum.Dark : ColorSchemaEnum.Light;
    const unistylesThemeName = getUnistylesThemeName(selectedTheme, colorScheme);

    useLayoutEffect(() => {
        UnistylesRuntime.setTheme(unistylesThemeName);
    }, [unistylesThemeName]);

    const changeTheme = (theme: SettingsState['theme']) => {
        dispatch(settingsSetAction({ theme }));
    };

    const toggleColorSchema = () => {
        const newColorScheme = colorScheme === ColorSchemaEnum.Dark ? ColorSchemaEnum.Light : ColorSchemaEnum.Dark;

        if (newColorScheme !== colorScheme) {
            dispatch(settingsSetAction({ isDarkColorSchema: !isDarkColorSchema }));

            if (Platform.OS === 'web') {
                document.documentElement.style.colorScheme = newColorScheme;
            } else {
                Appearance.setColorScheme(newColorScheme);
            }
        }
    };

    const theme = getTheme(selectedTheme, colorScheme);
    const navigationTheme = colorScheme === ColorSchemaEnum.Light ? DefaultTheme : DarkTheme;
    const fullNavigationTheme = {
        ...navigationTheme,
        ...theme,
        colors: {
            ...navigationTheme.colors,
            ...theme.colors
        }
    };
    const value = { changeTheme, colorScheme, theme, toggleColorSchema };

    return (
        <ThemeContext value={value}>
            <NavigationThemeProvider value={fullNavigationTheme}>{children}</NavigationThemeProvider>
        </ThemeContext>
    );
};
