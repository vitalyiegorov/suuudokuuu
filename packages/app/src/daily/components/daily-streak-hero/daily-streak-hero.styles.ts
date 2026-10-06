import { StyleSheet } from 'react-native-unistyles';

export const DailyStreakHeroStyles = StyleSheet.create(theme => ({
    bestStreak: {
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 18,
        textAlign: 'left'
    },
    labels: {
        flexShrink: 1,
        gap: theme.spacing.xs,
        paddingTop: theme.spacing.xs
    },
    root: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 14,
        width: '100%'
    },
    streak: {
        fontSize: 68,
        fontVariant: ['tabular-nums'],
        fontWeight: '800',
        letterSpacing: -2.5,
        lineHeight: 72,
        textAlign: 'left'
    },
    streakLabel: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 20,
        textAlign: 'left'
    }
}));
