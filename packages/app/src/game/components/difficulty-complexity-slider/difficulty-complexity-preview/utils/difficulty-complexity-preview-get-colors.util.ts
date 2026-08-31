import type { ThemeInterface } from '@suuudokuuu/ui/theme';

export const difficultyComplexityPreviewGetColors = (theme: Pick<ThemeInterface, 'colors'>) => ({
    backgroundColor: 'transparent',
    borderColor: theme.colors.surface.border
});
