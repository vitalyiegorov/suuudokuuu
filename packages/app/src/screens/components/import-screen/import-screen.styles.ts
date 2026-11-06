import { StyleSheet } from 'react-native-unistyles';

const boardMaxWidth = 480;

export const ImportScreenStyles = StyleSheet.create((theme, rt) => ({
    content: {
        alignSelf: 'center',
        flexGrow: 0,
        gap: theme.spacing.sm,
        maxWidth: boardMaxWidth + theme.spacing.lg * 2,
        paddingBottom: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        width: '100%'
    },
    boardSlot: { aspectRatio: 1, width: '100%', flexShrink: 0 },
    scroll: { flexGrow: 1, flexBasis: 0, flexShrink: 1, minHeight: 0 },
    headerContainer: { flexShrink: 0, paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md },
    footer: {
        alignSelf: 'center',
        width: '100%',
        maxWidth: boardMaxWidth + theme.spacing.lg * 2,
        flexShrink: 0,
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: rt.insets.bottom + theme.spacing.md
    },
    footerSlot: { minHeight: 52, justifyContent: 'center' },
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
