import type { ThemeInterface } from '@suuudokuuu/ui/theme';

type ThemeColorsType = ThemeInterface['colors'];

export interface ThemeContrastPairInterface {
    readonly foregroundKey: string;
    readonly backgroundKey: string;
    readonly getForeground: (colors: ThemeColorsType) => string;
    readonly getBackground: (colors: ThemeColorsType) => string;
    readonly minimumRatio: number;
}

export const ThemeContrastPairs: readonly ThemeContrastPairInterface[] = [
    {
        foregroundKey: 'label.main',
        backgroundKey: 'background',
        getForeground: colors => colors.label.main,
        getBackground: colors => colors.background,
        minimumRatio: 4.5
    },
    {
        foregroundKey: 'label.hint',
        backgroundKey: 'background',
        getForeground: colors => colors.label.hint,
        getBackground: colors => colors.background,
        minimumRatio: 3
    },
    {
        foregroundKey: 'value.text',
        backgroundKey: 'background',
        getForeground: colors => colors.value.text,
        getBackground: colors => colors.background,
        minimumRatio: 4.5
    },
    {
        foregroundKey: 'surface.raisedText',
        backgroundKey: 'surface.raised',
        getForeground: colors => colors.surface.raisedText,
        getBackground: colors => colors.surface.raised,
        minimumRatio: 4.5
    },
    {
        foregroundKey: 'surface.subtleText',
        backgroundKey: 'surface.subtle',
        getForeground: colors => colors.surface.subtleText,
        getBackground: colors => colors.surface.subtle,
        minimumRatio: 4.5
    },
    {
        foregroundKey: 'cell.activeText',
        backgroundKey: 'cell.active',
        getForeground: colors => colors.cell.activeText,
        getBackground: colors => colors.cell.active,
        minimumRatio: 3
    },
    {
        foregroundKey: 'cell.highlightedText',
        backgroundKey: 'cell.highlighted',
        getForeground: colors => colors.cell.highlightedText,
        getBackground: colors => colors.cell.highlighted,
        minimumRatio: 3
    },
    {
        foregroundKey: 'cell.activeValueText',
        backgroundKey: 'cell.activeValue',
        getForeground: colors => colors.cell.activeValueText,
        getBackground: colors => colors.cell.activeValue,
        minimumRatio: 3
    },
    {
        foregroundKey: 'candidate.text',
        backgroundKey: 'candidate.bg',
        getForeground: colors => colors.candidate.text,
        getBackground: colors => colors.candidate.bg,
        minimumRatio: 3
    },
    {
        foregroundKey: 'redFillText',
        backgroundKey: 'red',
        getForeground: colors => colors.redFillText,
        getBackground: colors => colors.red,
        minimumRatio: 3
    }
];
