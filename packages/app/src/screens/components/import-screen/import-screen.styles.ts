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
    scroll: { flex: 1 },
    headerContainer: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md },
    footer: { paddingHorizontal: theme.spacing.lg, paddingBottom: rt.insets.bottom + theme.spacing.md },
    padSlot: { minHeight: 100, width: '100%' },
    disabledButton: {
        opacity: 0.42
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.md,
        minHeight: 64
    },
    reset: {
        justifyContent: 'center',
        minHeight: 44,
        paddingHorizontal: theme.spacing.sm,
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
