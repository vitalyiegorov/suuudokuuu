import type { ThemeInterface } from '@suuudokuuu/ui/theme';

export const cloneThemeColors = (colors: ThemeInterface['colors']): ThemeInterface['colors'] => ({
    ...colors,
    label: { ...colors.label },
    candidate: { ...colors.candidate },
    cell: { ...colors.cell },
    value: { ...colors.value },
    surface: { ...colors.surface }
});
