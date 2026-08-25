import type { ThemeInterface } from '@suuudokuuu/ui';

export const settingsAppFooterGetSupportLinkColors = (theme: Pick<ThemeInterface, 'colors'>) => ({
    backgroundColor: theme.colors.surface.raised,
    borderColor: theme.colors.surface.border,
    textColor: theme.colors.surface.raisedText
});
