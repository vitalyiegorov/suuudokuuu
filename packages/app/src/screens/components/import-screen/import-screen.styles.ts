import { StyleSheet } from 'react-native-unistyles';

export const ImportScreenStyles = StyleSheet.create((theme, rt) => ({
    content: {
        alignSelf: 'center',
        flex: 1,
        gap: theme.spacing.sm,
        maxWidth: theme.contentWidth.standard,
        paddingBottom: rt.insets.bottom + theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        width: '100%'
    },
    disabledButton: {
        opacity: 0.42
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.md,
        minHeight: 44
    },
    reset: {
        justifyContent: 'center',
        minHeight: 44,
        _web: {
            cursor: 'pointer'
        }
    },
    resetPressed: {
        opacity: 0.6,
        transform: [{ scale: 0.97 }]
    },
    resetText: {
        fontSize: theme.typography.size.md,
        fontWeight: '700'
    },
    title: {
        flex: 1,
        marginBottom: 0,
        textAlign: 'left'
    }
}));
