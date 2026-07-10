import { StyleSheet } from 'react-native-unistyles';

import { WideContentWidthMultiplierConstant } from '../../constant/wide-content-width.constant';

export const LoserScreenStyles = StyleSheet.create(theme => ({
    actionsColumn: (sizeClass: 'compact' | 'wide') => ({
        gap: 18,
        ...(sizeClass === 'wide' ? { flex: 1 } : { width: '100%' })
    }),
    container: {
        flex: 1
    },
    content: (sizeClass: 'compact' | 'wide') => ({
        alignItems: sizeClass === 'wide' ? 'flex-start' : 'center',
        flexDirection: sizeClass === 'wide' ? 'row' : 'column',
        gap: 18,
        maxWidth: sizeClass === 'wide' ? theme.contentWidth.standard * WideContentWidthMultiplierConstant : theme.contentWidth.standard,
        width: '100%'
    }),
    contentContainer: {
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 24
    },
    summaryColumn: (sizeClass: 'compact' | 'wide') => ({
        gap: 18,
        ...(sizeClass === 'wide' ? { flex: 1 } : { width: '100%' })
    })
}));
