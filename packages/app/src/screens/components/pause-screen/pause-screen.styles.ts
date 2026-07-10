import { StyleSheet } from 'react-native-unistyles';

export const PauseScreenStyles = StyleSheet.create(theme => ({
    actionsColumn: {
        flex: 1,
        gap: 10
    },
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
    summaryColumn: {
        flex: 1,
        gap: 10
    }
}));
