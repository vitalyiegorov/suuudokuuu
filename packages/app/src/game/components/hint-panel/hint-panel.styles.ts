import { StyleSheet } from 'react-native-unistyles';

export const HintPanelStyles = StyleSheet.create((theme, rt) => ({
    container: {
        borderRadius: theme.radius.md,
        borderWidth: 1,
        bottom: rt.insets.bottom / 2 + theme.spacing.sm,
        gap: theme.spacing.sm,
        left: theme.spacing.sm,
        padding: theme.spacing.sm,
        position: 'absolute',
        right: theme.spacing.sm,
        zIndex: 10
    },
    content: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        gap: theme.spacing.xs
    },
    dismissButton: {
        flexShrink: 0
    },
    controls: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.xs,
        justifyContent: 'space-between'
    },
    stepControls: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.xs
    },
    dots: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.xs / 2
    },
    dot: {
        backgroundColor: theme.colors.text.hint,
        borderRadius: theme.radius.pill,
        height: 6,
        width: 6
    },
    dotActive: {
        backgroundColor: theme.colors.accent,
        borderRadius: theme.radius.pill,
        height: 8,
        width: 8
    },
    stepButton: {
        minWidth: 44
    }
}));
