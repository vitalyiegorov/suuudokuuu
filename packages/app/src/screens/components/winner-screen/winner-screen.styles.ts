import { StyleSheet } from 'react-native-unistyles';

export const WinnerScreenStyles = StyleSheet.create(theme => ({
    actionsColumn: (sizeClass: 'compact' | 'wide') => ({
        alignItems: 'center',
        gap: 10,
        ...(sizeClass === 'wide' ? { flex: 1 } : { width: '100%' })
    }),
    boldText: {
        fontWeight: 'bold'
    },
    container: (sizeClass: 'compact' | 'wide') => ({
        alignItems: 'center',
        alignSelf: 'center',
        flex: 1,
        flexDirection: sizeClass === 'wide' ? 'row' : 'column',
        gap: 20,
        justifyContent: 'center',
        width: '100%',
        ...(sizeClass === 'wide' && { maxWidth: theme.contentWidth.standard })
    }),
    summaryColumn: (sizeClass: 'compact' | 'wide') => ({
        alignItems: 'center',
        gap: 20,
        ...(sizeClass === 'wide' ? { flex: 1 } : { width: '100%' })
    })
}));
