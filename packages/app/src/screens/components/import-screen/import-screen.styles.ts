import { StyleSheet } from 'react-native-unistyles';

const boardMaxWidth = 480;

export const ImportScreenStyles = StyleSheet.create((theme, rt) => ({
    content: {
        alignSelf: 'center',
        gap: theme.spacing.sm,
        maxWidth: boardMaxWidth + theme.spacing.lg * 2,
        paddingHorizontal: theme.spacing.lg,
        width: '100%'
    },
    sourcesContent: { paddingVertical: theme.spacing.md },
    boardContent: { flexGrow: 1, justifyContent: 'center' },
    statusSlot: { flexShrink: 0, gap: theme.spacing.xs },
    scroll: { flexGrow: 1, flexBasis: 0, flexShrink: 1, minHeight: 0 },
    dock: {
        alignSelf: 'center',
        width: '100%',
        maxWidth: boardMaxWidth + theme.spacing.lg * 2,
        flexShrink: 0,
        gap: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: rt.insets.bottom + theme.spacing.md
    },
    playButton: { paddingVertical: theme.spacing.md },
    buttonText: { _web: { lineHeight: 'normal' } },
    disabledButton: {
        opacity: 0.42
    }
}));
