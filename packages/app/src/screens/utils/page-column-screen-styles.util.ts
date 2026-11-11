import type { UnistylesThemeInterface } from '@suuudokuuu/ui/theme';

export const pageColumnScrollViewStyle = (theme: UnistylesThemeInterface) => ({
    maxWidth: theme.contentWidth.standard,
    width: '100%' as const
});
