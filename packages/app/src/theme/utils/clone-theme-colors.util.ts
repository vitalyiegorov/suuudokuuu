import type { ThemeInterface } from '@suuudokuuu/ui/theme';

export const cloneThemeColors = (colors: ThemeInterface['colors']): ThemeInterface['colors'] => ({
    ...colors,
    text: { ...colors.text },
    board: { ...colors.board },
    candidate: { ...colors.candidate },
    numpad: { ...colors.numpad },
    surface: { ...colors.surface }
});
