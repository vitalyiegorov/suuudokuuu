import { StyleSheet } from 'react-native-unistyles';

export const DailyWeekCardStyles = StyleSheet.create(theme => ({
    strip: {
        flexDirection: 'row',
        paddingBottom: theme.spacing.md,
        paddingHorizontal: theme.spacing.sm,
        paddingTop: 14
    },
    bestStreak: {
        borderTopWidth: 1,
        fontSize: 13,
        fontWeight: '600',
        lineHeight: 18,
        paddingHorizontal: 16,
        paddingVertical: theme.spacing.md,
        textAlign: 'left'
    }
}));
