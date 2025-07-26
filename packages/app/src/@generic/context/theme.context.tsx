import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import React, { createContext, useState } from 'react';
import { Appearance, Platform, useColorScheme } from 'react-native';

import { emptyFn } from '@rnw-community/shared';

import { BlackTheme, WhiteTheme } from '../styles/theme';

import type { ReactNode } from 'react';

export const ThemeContext = createContext<{
    colorScheme: 'dark' | 'light';
    toggleTheme: () => void;
    theme: typeof BlackTheme;
}>({ colorScheme: 'light', toggleTheme: emptyFn, theme: BlackTheme });

export const ThemeProvider = ({ children }: { readonly children: ReactNode }) => {
    const osColorSchema = useColorScheme() ?? 'dark';

    const [colorScheme, setColorScheme] = useState<'dark' | 'light'>(osColorSchema);
    const theme = colorScheme === 'light' ? BlackTheme : WhiteTheme;

    const toggleTheme = () => {
        const newColorSchema = colorScheme === 'dark' ? 'light' : 'dark';
        setColorScheme(newColorSchema);

        // HINT: https://reactnavigation.org/docs/themes/?config=static#keeping-the-native-theme-in-sync
        if (Platform.OS === 'web') {
            document.documentElement.style.colorScheme = newColorSchema;
        } else {
            Appearance.setColorScheme(newColorSchema);
        }
    };

    return (
        <ThemeContext value={{ colorScheme, toggleTheme, theme }}>
            <NavigationThemeProvider value={theme}>{children}</NavigationThemeProvider>
        </ThemeContext>
    );
};
