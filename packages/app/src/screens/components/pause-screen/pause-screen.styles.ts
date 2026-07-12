import { StyleSheet } from 'react-native-unistyles';

export const PauseScreenStyles = StyleSheet.create(theme => ({
    actionsColumn: (sizeClass: 'compact' | 'wide') => ({
        alignItems: 'center',
        gap: 10,
        ...(sizeClass === 'wide' ? { flex: 1 } : { width: '100%' })
    }),
    container: (sizeClass: 'compact' | 'wide') => ({
        alignSelf: 'center',
        flex: 1,
        flexDirection: sizeClass === 'wide' ? 'row' : 'column',
        gap: 10,
        justifyContent: 'center',
        paddingBottom: 18,
        paddingHorizontal: 18,
        paddingTop: 20,
        width: '100%',
        ...(sizeClass === 'wide' && { maxWidth: theme.contentWidth.standard })
    }),
    summaryColumn: (sizeClass: 'compact' | 'wide') => ({
        gap: 10,
        ...(sizeClass === 'wide' ? { flex: 1 } : { width: '100%' })
    })
}));
