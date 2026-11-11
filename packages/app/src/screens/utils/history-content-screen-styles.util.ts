import { pageColumnScrollViewStyle } from './page-column-screen-styles.util';

import type { UnistylesThemeInterface } from '@suuudokuuu/ui/theme';

export const historyContentScreenStyles = (theme: UnistylesThemeInterface) => ({
    scrollView: pageColumnScrollViewStyle(theme),
    scrollViewContainer: {
        gap: 14,
        paddingHorizontal: 2
    }
});
