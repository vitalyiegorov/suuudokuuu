import type { ThemeInterface } from '@suuudokuuu/ui/theme';

type ThemeColorsType = ThemeInterface['colors'];

const ReadingTextMinimumRatio = 4.5;
const BoardGlyphMinimumRatio = 3;
const NumpadTextMinimumRatio = 1.4;
const SelectedCellTextMinimumRatio = 2.7;
const SameValueCellTextMinimumRatio = 2.4;

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
        minimumRatio: ReadingTextMinimumRatio
    },
    {
        foregroundKey: 'text.hint',
        backgroundKey: 'background',
        getForeground: colors => colors.text.hint,
        getBackground: colors => colors.background,
        minimumRatio: BoardGlyphMinimumRatio
    },
    {
        foregroundKey: 'numpad.text',
        backgroundKey: 'background',
        getForeground: colors => colors.numpad.text,
        getBackground: colors => colors.background,
        minimumRatio: NumpadTextMinimumRatio
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
        foregroundKey: 'board.selectedText',
        backgroundKey: 'board.selected',
        getForeground: colors => colors.board.selectedText,
        getBackground: colors => colors.board.selected,
        minimumRatio: SelectedCellTextMinimumRatio
    },
    {
        foregroundKey: 'board.sameValueText',
        backgroundKey: 'board.sameValue',
        getForeground: colors => colors.board.sameValueText,
        getBackground: colors => colors.board.sameValue,
        minimumRatio: SameValueCellTextMinimumRatio
    },
    {
        foregroundKey: 'candidate.text',
        backgroundKey: 'candidate.fill',
        getForeground: colors => colors.candidate.text,
        getBackground: colors => colors.candidate.fill,
        minimumRatio: BoardGlyphMinimumRatio
    },
    {
        foregroundKey: 'dangerText',
        backgroundKey: 'danger',
        getForeground: colors => colors.dangerText,
        getBackground: colors => colors.danger,
        minimumRatio: BoardGlyphMinimumRatio
    }
];
