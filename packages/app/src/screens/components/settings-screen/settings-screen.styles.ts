import { StyleSheet } from 'react-native-unistyles';

import { WideContentWidthMultiplierConstant } from '../../constant/wide-content-width.constant';

export const SettingsScreenStyles = StyleSheet.create(theme => ({
    content: {
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xl
    },
    scrollView: (sizeClass: 'compact' | 'wide') => ({
        maxWidth: sizeClass === 'wide' ? theme.contentWidth.standard * WideContentWidthMultiplierConstant : theme.contentWidth.standard,
        width: '100%'
    }),
    scrollViewContent: (sizeClass: 'compact' | 'wide') => ({
        flexDirection: sizeClass === 'wide' ? 'row' : 'column',
        alignItems: sizeClass === 'wide' ? 'flex-start' : 'stretch',
        gap: theme.spacing.xl,
        paddingBottom: theme.spacing.sm
    }),
    primaryColumn: {
        flex: 2,
        gap: theme.spacing.xl
    },
    secondaryColumn: (sizeClass: 'compact' | 'wide') => ({
        gap: theme.spacing.xl,
        ...(sizeClass === 'wide' ? { flex: 1 } : { width: '100%' })
    })
}));
