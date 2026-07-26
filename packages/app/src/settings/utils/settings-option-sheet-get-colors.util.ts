import type { ThemeInterface } from '@suuudokuuu/ui/theme';

export const settingsOptionSheetGetColors = (theme: ThemeInterface) => ({
    descriptionColor: theme.colors.label.hint,
    panelBackground: theme.colors.background,
    panelText: theme.colors.label.main
});
