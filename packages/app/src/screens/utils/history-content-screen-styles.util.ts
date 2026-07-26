import { PageHorizontalPaddingConstant } from '../../@generic/constants/page-horizontal-padding.constant';

import { pageColumnScrollViewStyle } from './page-column-screen-styles.util';

import type { UnistylesThemeInterface } from '@suuudokuuu/ui';

export const historyContentScreenStyles = (theme: UnistylesThemeInterface) => ({
    content: {
        alignItems: 'center' as const,
        paddingHorizontal: PageHorizontalPaddingConstant
    },
    scrollView: pageColumnScrollViewStyle(theme),
    scrollViewContainer: {
        gap: 14,
        paddingHorizontal: 2
    }
});
