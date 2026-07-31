import type { ThemeInterface } from '@suuudokuuu/ui/theme';

export const settingsOptionSheetGetColors = (theme: ThemeInterface) => ({
    descriptionColor: theme.colors.text.hint,
    panelBackground: theme.colors.background,
    panelText: theme.colors.text.primary
});
