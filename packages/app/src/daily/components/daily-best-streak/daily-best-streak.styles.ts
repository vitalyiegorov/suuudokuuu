import { StyleSheet } from 'react-native-unistyles';

export const DailyBestStreakStyles = StyleSheet.create(theme => ({
    root: {
        fontSize: 13,
        fontWeight: '600',
        lineHeight: 18,
        paddingHorizontal: 16,
        paddingVertical: theme.spacing.md,
        textAlign: 'left'
    }
}));
