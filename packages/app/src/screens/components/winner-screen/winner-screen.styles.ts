import { StyleSheet } from 'react-native-unistyles';

export const WinnerScreenStyles = StyleSheet.create(theme => ({
    actionsColumn: {
        flex: 1,
        gap: 10
    },
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
    summaryColumn: {
        alignItems: 'center',
        flex: 1,
        gap: 20
    }
}));
