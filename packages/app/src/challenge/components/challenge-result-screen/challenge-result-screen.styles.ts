import { StyleSheet } from 'react-native-unistyles';

export const ChallengeResultScreenStyles = StyleSheet.create(theme => ({
    actionsColumn: (sizeClass: 'compact' | 'wide') => ({
        alignItems: 'center',
        gap: 20,
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
        gap: theme.spacing.lg,
        justifyContent: 'center',
        width: '100%',
        ...(sizeClass === 'wide' && { maxWidth: theme.contentWidth.standard })
    }),
    differenceText: {
        marginTop: 10
    },
    icon: {
        marginBottom: 10
    },
    messageText: {
        marginTop: 10
    },
    statsContainer: {
        alignItems: 'center',
        gap: 4
    },
    summaryColumn: (sizeClass: 'compact' | 'wide') => ({
        alignItems: 'center',
        gap: 20,
        ...(sizeClass === 'wide' ? { flex: 1 } : { width: '100%' })
    })
}));
