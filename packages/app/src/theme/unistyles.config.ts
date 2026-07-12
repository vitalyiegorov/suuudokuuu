import { Breakpoints } from '@suuudokuuu/ui/theme';
import { StyleSheet } from 'react-native-unistyles';

import { UnistylesThemesConstant } from './constant/unistyles-themes.constant';

StyleSheet.configure({
    settings: {
        initialTheme: 'bwLight',
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
