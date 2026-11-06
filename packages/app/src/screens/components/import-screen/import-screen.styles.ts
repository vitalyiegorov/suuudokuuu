import { StyleSheet } from 'react-native-unistyles';

export const ImportScreenStyles = StyleSheet.create((theme, rt) => ({
    content: (footerHeight: number) => ({
        alignSelf: 'center',
        flexGrow: 0,
        gap: theme.spacing.sm,
        maxWidth: theme.contentWidth.standard,
        paddingBottom: footerHeight + theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        width: '100%'
    }),
    scroll: { flexGrow: 0, flexShrink: 1, minHeight: 0 },
    headerContainer: { flexShrink: 0, paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md },
    footer: {
        alignSelf: 'center',
        width: '100%',
        maxWidth: theme.contentWidth.standard,
        flexShrink: 0,
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: rt.insets.bottom + theme.spacing.md
    },
    padSlot: {
        alignSelf: 'center',
        maxWidth: theme.contentWidth.standard,
        flexShrink: 0,
        width: '100%',
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.md
    },
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
