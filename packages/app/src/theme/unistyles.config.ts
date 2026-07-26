import { Breakpoints } from '@suuudokuuu/ui/theme';
import { Appearance } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { UnistylesThemesConstant } from './constant/unistyles-themes.constant';
import { getInitialUnistylesThemeName } from './utils/get-initial-unistyles-theme-name.util';

StyleSheet.configure({
    settings: {
        initialTheme: () => getInitialUnistylesThemeName(Appearance.getColorScheme()),
        adaptiveThemes: false
    },
    themes: UnistylesThemesConstant,
    breakpoints: Breakpoints
});

type RegisteredUnistylesThemesType = typeof UnistylesThemesConstant;
type RegisteredUnistylesBreakpointsType = typeof Breakpoints;

declare module 'react-native-unistyles' {
    export interface UnistylesThemes extends RegisteredUnistylesThemesType {}
    export interface UnistylesBreakpoints extends RegisteredUnistylesBreakpointsType {}
}
