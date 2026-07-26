import type { ThemeInterface } from '@suuudokuuu/ui';

export const settingsAppFooterGetSupportLinkColors = (theme: ThemeInterface) => ({
    backgroundColor: theme.colors.surface.raised,
    borderColor: theme.colors.candidate.border,
    textColor: theme.colors.surface.raisedText
});
