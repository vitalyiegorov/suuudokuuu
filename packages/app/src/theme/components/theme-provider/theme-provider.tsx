import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from 'expo-router';
import { useEffect } from 'react';
import { Appearance, Platform } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';

import { isDefined } from '@rnw-community/shared';

import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { settingsSetAction } from '../../../settings/store/settings.actions';
import { settingsKeySelector, settingsThemeSelector } from '../../../settings/store/settings.selectors';
import { ThemeContext } from '../../context/theme.context';
import { ColorSchemaEnum } from '../../enum/color-schema.enum';
import { customThemesSelector } from '../../store/custom-themes.selectors';
import { isCustomThemeId } from '../../type-guard/is-custom-theme-id.type-guard';
import { applyCustomUnistylesTheme } from '../../utils/apply-custom-unistyles-theme.util';
import { getUnistylesThemeName } from '../../utils/get-unistyles-theme-name.util';
import { resolveTheme } from '../../utils/resolve-theme.util';
import { synchronizeUnistylesTheme } from '../../utils/synchronize-unistyles-theme.util';

import type { SettingsState } from '../../../settings/store/settings.state';
import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

export const ThemeProvider = ({ children }: Props) => {
    const dispatch = useAppDispatch();
    const selectedTheme = useAppSelector(settingsThemeSelector);
    const customThemes = useAppSelector(customThemesSelector);
    const isDarkColorSchema = useAppSelector(settingsKeySelector('isDarkColorSchema'));

    const colorScheme = isDarkColorSchema ? ColorSchemaEnum.Dark : ColorSchemaEnum.Light;
    const unistylesThemeName = getUnistylesThemeName(selectedTheme, colorScheme);
    const activeCustomTheme = customThemes.find(theme => isCustomThemeId(selectedTheme) && theme.id === selectedTheme);

    useEffect(() => {
        if (isDefined(activeCustomTheme)) {
            applyCustomUnistylesTheme(UnistylesRuntime, activeCustomTheme);
        }

        synchronizeUnistylesTheme(UnistylesRuntime, unistylesThemeName);
    }, [activeCustomTheme, unistylesThemeName]);

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

    const theme = resolveTheme(selectedTheme, colorScheme, customThemes);
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
