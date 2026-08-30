import { StyleSheet } from 'react-native-unistyles';

export const DailyStreakHeroStyles = StyleSheet.create(theme => ({
    bestStreak: {
        fontSize: 13,
        lineHeight: 18,
        textAlign: 'left'
    },
    date: {
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'left'
    },
    eyebrow: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1.2,
        lineHeight: 16,
        textAlign: 'left',
        textTransform: 'uppercase'
    },
    header: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        gap: theme.spacing.sm,
        justifyContent: 'space-between',
        width: '100%'
    },
    heroNumber: {
        fontSize: 64,
        fontWeight: '800',
        lineHeight: 72,
        textAlign: 'left'
    },
    status: {
        fontSize: 13,
        fontWeight: '700',
        lineHeight: 18,
        textAlign: 'right'
    },
    streakLabel: {
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'left'
    }
}));
