import { StyleSheet } from 'react-native-unistyles';

export const ImportScreenStyles = StyleSheet.create((theme, rt) => ({
    content: {
        alignSelf: 'center',
        flexGrow: 1,
        gap: theme.spacing.sm,
        maxWidth: theme.contentWidth.standard,
        paddingBottom: rt.insets.bottom + theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        width: '100%'
    },
    scroll: { flex: 1, minHeight: 0 },
    headerContainer: { flexShrink: 0, paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md },
    footer: { flexShrink: 0, paddingHorizontal: theme.spacing.lg, paddingBottom: rt.insets.bottom + theme.spacing.md },
    padSlot: { flexShrink: 0, width: '100%' },
    disabledButton: {
        opacity: 0.42
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.md,
        minHeight: 64
    },
    resetSlot: { width: 44, height: 44 },
    reset: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 44,
        width: 44,
        borderRadius: theme.radius.sm,
        _web: {
            cursor: 'pointer'
        }
    },
    resetPressed: {
        opacity: 0.6,
        transform: [{ scale: 0.97 }]
    },
    title: {
        flex: 1,
        marginBottom: 0,
        textAlign: 'left'
    }
}));
