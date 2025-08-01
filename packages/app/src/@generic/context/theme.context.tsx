import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import React, { createContext } from 'react';
import { Appearance, Platform } from 'react-native';

import { emptyFn } from '@rnw-community/shared';

import { settingsSetAction } from '../../settings/store/settings.actions';
import { settingsThemeSelector } from '../../settings/store/settings.selectors';
import { useAppDispatch } from '../hooks/use-app-dispatch.hook';
import { useAppSelector } from '../hooks/use-app-selector.hook';
import { BlackTheme, WhiteTheme } from '../styles/theme';

import type { SettingsState } from '../../settings/store/settings.state';
import type { OnEventFn } from '@rnw-community/shared';
import type { ReactNode } from 'react';

export const ThemeContext = createContext<{
    colorScheme: SettingsState['theme'];
    /** @deprecated Use `changeTheme` instead */
    toggleTheme: OnEventFn;
    changeTheme: OnEventFn<SettingsState['theme']>;
    theme: typeof BlackTheme;
}>({ colorScheme: 'light', toggleTheme: emptyFn, changeTheme: emptyFn, theme: BlackTheme });

const availableThemes = {
    dark: BlackTheme,
    light: WhiteTheme
};

export const ThemeProvider = ({ children }: { readonly children: ReactNode }) => {
    const dispatch = useAppDispatch();
    const colorScheme = useAppSelector(settingsThemeSelector);

    const changeTheme = (newColorScheme: SettingsState['theme']) => {
        if (newColorScheme !== colorScheme) {
            dispatch(settingsSetAction({ theme: newColorScheme }));

            // HINT: https://reactnavigation.org/docs/themes/?config=static#keeping-the-native-theme-in-sync
            if (Platform.OS === 'web') {
                document.documentElement.style.colorScheme = newColorScheme;
            } else {
                Appearance.setColorScheme(newColorScheme);
            }
        }
    };
    const toggleTheme = () => {
        const newColorSchema = colorScheme === 'dark' ? 'light' : 'dark';
        changeTheme(newColorSchema);
    };

    const theme = availableThemes[colorScheme];

    return (
        <ThemeContext value={{ colorScheme, toggleTheme, theme, changeTheme }}>
            <NavigationThemeProvider value={theme}>{children}</NavigationThemeProvider>
        </ThemeContext>
    );
};
