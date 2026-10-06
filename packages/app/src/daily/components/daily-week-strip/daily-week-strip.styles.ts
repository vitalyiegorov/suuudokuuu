import { StyleSheet } from 'react-native-unistyles';

export const DailyWeekStripStyles = StyleSheet.create(theme => ({
    strip: {
        flexDirection: 'row',
        paddingBottom: theme.spacing.md,
        paddingHorizontal: theme.spacing.sm,
        paddingTop: 14
    }
}));
