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
    progress: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.4,
        textTransform: 'uppercase'
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
    actionControls: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.xs
    },
    stepButton: {
        minWidth: 44
    }
}));
