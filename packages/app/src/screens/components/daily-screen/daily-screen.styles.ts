import { StyleSheet } from 'react-native-unistyles';

export const DailyScreenStyles = StyleSheet.create(theme => ({
    actionBar: {
        paddingHorizontal: 20,
        paddingBottom: theme.spacing.sm,
        paddingTop: theme.spacing.sm,
        width: '100%'
    },
    actionButton: {
        borderRadius: 999,
        minHeight: 56,
        width: '100%'
    },
    scrollContent: {
        alignItems: 'stretch',
        gap: theme.spacing.lg,
        paddingBottom: 28,
        paddingHorizontal: 20
    },
    scrollView: {
        flex: 1,
        width: '100%'
    },
    title: {
        fontSize: 30,
        lineHeight: 36,
        marginBottom: 0,
        minWidth: 0,
        textAlign: 'left'
    }
}));
