import { StyleSheet } from 'react-native-unistyles';

export const ChallengeAcceptScreenStyles = StyleSheet.create(theme => ({
    buttonsWrapper: (sizeClass: 'compact' | 'wide') => ({
        alignItems: 'center',
        gap: 10,
        ...(sizeClass === 'wide' ? { flex: 1 } : { width: '100%' })
    }),
    challengeInfo: {
        alignItems: 'center',
        gap: 4,
        marginVertical: 10
    },
    container: (sizeClass: 'compact' | 'wide') => ({
        alignItems: 'center',
        alignSelf: 'center',
        flex: 1,
        flexDirection: sizeClass === 'wide' ? 'row' : 'column',
        gap: theme.spacing.xl,
        justifyContent: 'center',
        padding: 10,
        width: '100%',
        ...(sizeClass === 'wide' && { maxWidth: theme.contentWidth.standard })
    }),
    icon: {
        marginBottom: 10
    },
    opponentTime: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    summaryColumn: (sizeClass: 'compact' | 'wide') => ({
        alignItems: 'center',
        ...(sizeClass === 'wide' ? { flex: 1 } : { width: '100%' })
    })
}));
