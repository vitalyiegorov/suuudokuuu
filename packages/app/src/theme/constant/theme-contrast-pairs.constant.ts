import type { ThemeInterface } from '@suuudokuuu/ui/theme';

type ThemeColorsType = ThemeInterface['colors'];

const ReadingTextMinimumRatio = 4.5;
const BoardGlyphMinimumRatio = 3;
const ValueTextOnBackgroundMinimumRatio = 1.4;
const ActiveCellTextMinimumRatio = 2.7;
const HighlightedCellTextMinimumRatio = 1.9;
const ActiveValueCellTextMinimumRatio = 2.4;

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
        minimumRatio: ReadingTextMinimumRatio
    },
    {
        foregroundKey: 'label.hint',
        backgroundKey: 'background',
        getForeground: colors => colors.label.hint,
        getBackground: colors => colors.background,
        minimumRatio: BoardGlyphMinimumRatio
    },
    {
        foregroundKey: 'value.text',
        backgroundKey: 'background',
        getForeground: colors => colors.value.text,
        getBackground: colors => colors.background,
        minimumRatio: ValueTextOnBackgroundMinimumRatio
    },
    {
        foregroundKey: 'surface.raisedText',
        backgroundKey: 'surface.raised',
        getForeground: colors => colors.surface.raisedText,
        getBackground: colors => colors.surface.raised,
        minimumRatio: ReadingTextMinimumRatio
    },
    {
        foregroundKey: 'surface.subtleText',
        backgroundKey: 'surface.subtle',
        getForeground: colors => colors.surface.subtleText,
        getBackground: colors => colors.surface.subtle,
        minimumRatio: ReadingTextMinimumRatio
    },
    {
        foregroundKey: 'cell.activeText',
        backgroundKey: 'cell.active',
        getForeground: colors => colors.cell.activeText,
        getBackground: colors => colors.cell.active,
        minimumRatio: ActiveCellTextMinimumRatio
    },
    {
        foregroundKey: 'cell.highlightedText',
        backgroundKey: 'cell.highlighted',
        getForeground: colors => colors.cell.highlightedText,
        getBackground: colors => colors.cell.highlighted,
        minimumRatio: HighlightedCellTextMinimumRatio
    },
    {
        foregroundKey: 'cell.activeValueText',
        backgroundKey: 'cell.activeValue',
        getForeground: colors => colors.cell.activeValueText,
        getBackground: colors => colors.cell.activeValue,
        minimumRatio: ActiveValueCellTextMinimumRatio
    },
    {
        foregroundKey: 'candidate.text',
        backgroundKey: 'candidate.bg',
        getForeground: colors => colors.candidate.text,
        getBackground: colors => colors.candidate.bg,
        minimumRatio: BoardGlyphMinimumRatio
    },
    {
        foregroundKey: 'redFillText',
        backgroundKey: 'red',
        getForeground: colors => colors.redFillText,
        getBackground: colors => colors.red,
        minimumRatio: BoardGlyphMinimumRatio
    }
];
