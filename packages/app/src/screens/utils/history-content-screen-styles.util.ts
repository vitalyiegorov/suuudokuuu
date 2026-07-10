import { WideContentWidthMultiplierConstant } from '../constant/wide-content-width.constant';

import type { UnistylesThemeInterface } from '@suuudokuuu/ui';

export const historyContentScreenStyles = (theme: UnistylesThemeInterface) => ({
    content: {
        alignItems: 'center' as const,
        paddingHorizontal: 18
    },
    scrollView: (sizeClass: 'compact' | 'wide') => ({
        maxWidth: sizeClass === 'wide' ? theme.contentWidth.standard * WideContentWidthMultiplierConstant : theme.contentWidth.standard,
        width: '100%' as const
    }),
    scrollViewContainer: {
        gap: 14,
        paddingHorizontal: 2
    }
});
