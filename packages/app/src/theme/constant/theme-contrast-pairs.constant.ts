import type { ThemeInterface } from '@suuudokuuu/ui/theme';

type ThemeColorsType = ThemeInterface['colors'];

const ThemeContrastMinimumRatio = 4.5;
const ThemeContrastLargeTextMinimumRatio = 3;

export interface ThemeContrastPairInterface {
    readonly foregroundKey: string;
    readonly backgroundKey: string;
    readonly getForeground: (colors: ThemeColorsType) => string;
    readonly getBackground: (colors: ThemeColorsType) => string;
    readonly minimumRatio: number;
}

export const ThemeContrastPairs: readonly ThemeContrastPairInterface[] = [
    {
        foregroundKey: 'text.primary',
        backgroundKey: 'background',
        getForeground: colors => colors.text.primary,
        getBackground: colors => colors.background,
        minimumRatio: ThemeContrastMinimumRatio
    },
    {
        foregroundKey: 'text.hint',
        backgroundKey: 'background',
        getForeground: colors => colors.text.hint,
        getBackground: colors => colors.background,
        minimumRatio: ThemeContrastMinimumRatio
    },
    {
        foregroundKey: 'ink',
        backgroundKey: 'surface.raised',
        getForeground: colors => colors.ink,
        getBackground: colors => colors.surface.raised,
        minimumRatio: ThemeContrastMinimumRatio
    },
    {
        foregroundKey: 'ink',
        backgroundKey: 'board.filled',
        getForeground: colors => colors.ink,
        getBackground: colors => colors.board.filled,
        minimumRatio: ThemeContrastMinimumRatio
    },
    {
        foregroundKey: 'ink',
        backgroundKey: 'board.error',
        getForeground: colors => colors.ink,
        getBackground: colors => colors.board.error,
        minimumRatio: ThemeContrastMinimumRatio
    },
    {
        foregroundKey: 'board.selectedText',
        backgroundKey: 'board.selected',
        getForeground: colors => colors.board.selectedText,
        getBackground: colors => colors.board.selected,
        minimumRatio: ThemeContrastLargeTextMinimumRatio
    },
    {
        foregroundKey: 'board.sameValueText',
        backgroundKey: 'board.sameValue',
        getForeground: colors => colors.board.sameValueText,
        getBackground: colors => colors.board.sameValue,
        minimumRatio: ThemeContrastLargeTextMinimumRatio
    },
    {
        foregroundKey: 'candidate.text',
        backgroundKey: 'candidate.fill',
        getForeground: colors => colors.candidate.text,
        getBackground: colors => colors.candidate.fill,
        minimumRatio: ThemeContrastMinimumRatio
    },
    {
        foregroundKey: 'candidate.textSelected',
        backgroundKey: 'candidate.fillSelected',
        getForeground: colors => colors.candidate.textSelected,
        getBackground: colors => colors.candidate.fillSelected,
        minimumRatio: ThemeContrastMinimumRatio
    },
    {
        foregroundKey: 'numpad.text',
        backgroundKey: 'surface.raised',
        getForeground: colors => colors.numpad.text,
        getBackground: colors => colors.surface.raised,
        minimumRatio: ThemeContrastMinimumRatio
    },
    {
        foregroundKey: 'numpad.text',
        backgroundKey: 'numpad.track',
        getForeground: colors => colors.numpad.text,
        getBackground: colors => colors.numpad.track,
        minimumRatio: ThemeContrastMinimumRatio
    },
    {
        foregroundKey: 'numpad.trackFilledText',
        backgroundKey: 'numpad.trackFilled',
        getForeground: colors => colors.numpad.trackFilledText,
        getBackground: colors => colors.numpad.trackFilled,
        minimumRatio: ThemeContrastMinimumRatio
    },
    {
        foregroundKey: 'surface.raisedText',
        backgroundKey: 'surface.raised',
        getForeground: colors => colors.surface.raisedText,
        getBackground: colors => colors.surface.raised,
        minimumRatio: ThemeContrastMinimumRatio
    },
    {
        foregroundKey: 'surface.subtleText',
        backgroundKey: 'surface.subtle',
        getForeground: colors => colors.surface.subtleText,
        getBackground: colors => colors.surface.subtle,
        minimumRatio: ThemeContrastMinimumRatio
    },
    {
        foregroundKey: 'dangerText',
        backgroundKey: 'danger',
        getForeground: colors => colors.dangerText,
        getBackground: colors => colors.danger,
        minimumRatio: ThemeContrastMinimumRatio
    }
];
