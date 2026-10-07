import { StyleSheet } from 'react-native-unistyles';

export const DailyWeekCardStyles = StyleSheet.create(theme => ({
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
