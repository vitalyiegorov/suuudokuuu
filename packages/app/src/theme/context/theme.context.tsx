import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import React, { createContext } from 'react';
import { Appearance, Platform } from 'react-native';

import { emptyFn } from '@rnw-community/shared';

import { useAppDispatch } from '../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../@generic/hooks/use-app-selector.hook';
import { settingsSetAction } from '../../settings/store/settings.actions';
import { settingsKeySelector, settingsThemeSelector } from '../../settings/store/settings.selectors';
import { ColorSchemaEnum } from '../enum/color-schema.enum';
import { BWLightTheme } from '../themes/bw.theme';
import { getTheme } from '../utils/get-theme.util';

import type { SettingsState } from '../../settings/store/settings.state';
import type { BWDarkTheme } from '../themes/bw.theme';
import type { OnEventFn } from '@rnw-community/shared';
import type { ReactNode } from 'react';

export const ThemeContext = createContext<{
    colorScheme: ColorSchemaEnum;
    changeTheme: OnEventFn<SettingsState['theme']>;
    toggleColorSchema: OnEventFn;
    theme: typeof BWDarkTheme;
}>({ colorScheme: ColorSchemaEnum.Light, toggleColorSchema: emptyFn, theme: BWLightTheme, changeTheme: emptyFn });

export const ThemeProvider = ({ children }: { readonly children: ReactNode }) => {
    const dispatch = useAppDispatch();
    const selectedTheme = useAppSelector(settingsThemeSelector);
    const isDarkColorSchema = useAppSelector(settingsKeySelector('isDarkColorSchema'));

    const colorScheme = isDarkColorSchema ? ColorSchemaEnum.Dark : ColorSchemaEnum.Light;

    const changeTheme = (theme: SettingsState['theme']) => {
        dispatch(settingsSetAction({ theme }));
    };

    const toggleColorSchema = () => {
        const newColorScheme = colorScheme === ColorSchemaEnum.Dark ? ColorSchemaEnum.Light : ColorSchemaEnum.Dark;

        if (newColorScheme !== colorScheme) {
            dispatch(settingsSetAction({ isDarkColorSchema: !isDarkColorSchema }));

            // HINT: https://reactnavigation.org/docs/themes/?config=static#keeping-the-native-theme-in-sync
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

    return (
        <ThemeContext value={{ theme, colorScheme, toggleColorSchema, changeTheme }}>
            <NavigationThemeProvider value={fullNavigationTheme}>{children}</NavigationThemeProvider>
        </ThemeContext>
    );
};
