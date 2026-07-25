import { StyleSheet } from 'react-native-unistyles';

export const PauseScreenStyles = StyleSheet.create(theme => ({
    asideColumn: (sizeClass: 'compact' | 'wide') => ({
        gap: 14,
        ...(sizeClass === 'wide' ? { flex: 1 } : { width: '100%' })
    }),
    container: {
        flex: 1
    },
    content: (sizeClass: 'compact' | 'wide') => ({
        alignItems: 'stretch',
        flexGrow: 1,
        gap: 14,
        paddingHorizontal: 18,
        paddingTop: 16,
        width: '100%',
        ...(sizeClass === 'wide' ? { alignSelf: 'center', flexDirection: 'row', maxWidth: theme.contentWidth.standard } : { maxWidth: 560 })
    }),
    summaryColumn: (sizeClass: 'compact' | 'wide') => ({
        gap: 14,
        ...(sizeClass === 'wide' ? { flex: 1 } : { width: '100%' })
    })
}));
