import { StyleSheet } from 'react-native-unistyles';

export const HistoryEmptyStateStyles = StyleSheet.create(theme => ({
    container: {
        borderRadius: theme.radius.lg,
        borderWidth: StyleSheet.hairlineWidth,
        gap: theme.spacing.sm,
        paddingHorizontal: 18,
        paddingVertical: 22,
        width: '100%'
    },
    message: {
        fontSize: theme.typography.size.sm,
        lineHeight: 19,
        textAlign: 'left'
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        lineHeight: 27,
        textAlign: 'left'
    }
}));
