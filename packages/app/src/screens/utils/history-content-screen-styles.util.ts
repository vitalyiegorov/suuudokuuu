import { pageColumnScrollViewStyle } from './page-column-screen-styles.util';

import type { UnistylesThemeInterface } from '@suuudokuuu/ui';

export const historyContentScreenStyles = (theme: UnistylesThemeInterface) => ({
    content: {
        alignItems: 'center' as const,
        paddingHorizontal: 18
    },
    scrollView: pageColumnScrollViewStyle(theme),
    scrollViewContainer: {
        gap: 14,
        paddingHorizontal: 2
    }
});
