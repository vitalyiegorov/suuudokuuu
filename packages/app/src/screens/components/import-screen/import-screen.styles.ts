import { StyleSheet } from 'react-native-unistyles';

export const ImportScreenStyles = StyleSheet.create(theme => ({
    actions: {
        gap: theme.spacing.sm,
        width: '100%'
    },
    content: {
        alignSelf: 'center',
        gap: theme.spacing.md,
        maxWidth: theme.contentWidth.standard,
        paddingBottom: theme.spacing.xl,
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.lg,
        width: '100%'
    },
    disabledButton: {
        opacity: 0.42
    },
    hint: {
        fontSize: theme.typography.size.md,
        textAlign: 'center'
    },
    input: {
        borderRadius: 8,
        borderWidth: 1,
        fontSize: theme.typography.size.sm,
        minHeight: 72,
        paddingHorizontal: 12,
        paddingVertical: 10,
        textAlignVertical: 'top'
    },
    title: {
        marginBottom: 0
    }
}));
