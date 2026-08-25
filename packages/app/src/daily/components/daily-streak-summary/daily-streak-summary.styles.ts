import { StyleSheet } from 'react-native-unistyles';

export const DailyStreakSummaryStyles = StyleSheet.create(theme => ({
    content: {
        alignItems: 'center',
        gap: theme.spacing.xs,
        width: '100%'
    },
    label: {
        fontSize: 13,
        lineHeight: 18
    },
    value: {
        fontSize: 22,
        fontWeight: '800',
        lineHeight: 28
    }
}));
