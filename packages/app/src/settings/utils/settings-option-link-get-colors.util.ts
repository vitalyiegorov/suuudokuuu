import type { ThemeInterface } from '@suuudokuuu/ui/theme';

export const settingsOptionLinkGetColors = (theme: Pick<ThemeInterface, 'colors'>) => ({
    valueColor: theme.colors.surface.subtleText
});
