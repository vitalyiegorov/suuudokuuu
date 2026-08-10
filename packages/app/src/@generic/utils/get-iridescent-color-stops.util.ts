import type { ThemeInterface } from '@suuudokuuu/ui/theme';

export type IridescentColorStops = readonly [string, string, string, string];

export const getIridescentColorStops = (theme: ThemeInterface): IridescentColorStops => [
    theme.colors.accent,
    theme.colors.text.primary,
    theme.colors.danger,
    theme.colors.accent
];
