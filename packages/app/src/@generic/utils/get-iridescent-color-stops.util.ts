import type { ThemeInterface } from '@suuudokuuu/ui/theme';

export type IridescentColorStops = readonly [string, string, string, string];

export const getIridescentColorStops = (theme: Pick<ThemeInterface, 'colors'>): IridescentColorStops => [
    theme.colors.accent,
    theme.colors.surface.raisedText,
    theme.colors.board.selected,
    theme.colors.accent
];
