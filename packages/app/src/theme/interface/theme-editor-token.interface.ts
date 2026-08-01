import type { ThemeInterface } from '@suuudokuuu/ui/theme';

type ThemeColorsType = ThemeInterface['colors'];

export interface ThemeEditorTokenInterface {
    readonly key: string;
    readonly getValue: (colors: ThemeColorsType) => string;
    readonly setValue: (colors: ThemeColorsType, value: string) => ThemeColorsType;
}

export interface ThemeEditorSectionInterface {
    readonly key: string;
    readonly tokens: readonly ThemeEditorTokenInterface[];
}
