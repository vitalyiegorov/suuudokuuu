import type { ThemeInterface } from '@suuudokuuu/ui/theme';

export const settingsOptionSheetGetColors = (theme: Pick<ThemeInterface, 'colors'>) => ({
    descriptionColor: theme.colors.text.hint,
    panelBackground: theme.colors.background,
    panelText: theme.colors.text.primary
});
