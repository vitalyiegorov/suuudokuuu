import type { ThemeInterface } from '@suuudokuuu/ui';

export const settingsAppFooterGetSupportLinkColors = (theme: ThemeInterface) => ({
    backgroundColor: theme.colors.black,
    borderColor: theme.colors.black,
    textColor: theme.colors.label.inverted
});
