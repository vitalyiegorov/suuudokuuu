import { StyleSheet } from 'react-native-unistyles';

export const ChallengeResultRivalTimeCardStyles = StyleSheet.create(theme => ({
    card: {
        alignItems: 'center',
        gap: theme.spacing.xs,
        paddingHorizontal: theme.spacing.xs,
        paddingVertical: theme.spacing.sm,
        width: '100%'
    },
    label: {
        fontFamily: 'Inter_700Bold',
        fontSize: 11,
        letterSpacing: 1,
        textAlign: 'center',
        textTransform: 'uppercase'
    },
    value: {
        fontFamily: 'Inter_700Bold',
        fontSize: 44,
        fontVariant: ['tabular-nums'],
        letterSpacing: -1.4,
        textAlign: 'center'
    }
}));
