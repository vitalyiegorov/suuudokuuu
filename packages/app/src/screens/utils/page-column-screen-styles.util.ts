import type { UnistylesThemeInterface } from '@suuudokuuu/ui';

export const pageColumnScrollViewStyle = (theme: UnistylesThemeInterface) => ({
    maxWidth: theme.contentWidth.standard,
    width: '100%' as const
});
