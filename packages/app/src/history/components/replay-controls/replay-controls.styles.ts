import { StyleSheet } from 'react-native-unistyles';

const ReplayControlsMaxWidth = 280;

export const ReplayControlsStyles = StyleSheet.create(theme => ({
    container: {
        alignSelf: 'center',
        gap: theme.spacing.lg,
        maxWidth: ReplayControlsMaxWidth,
        width: '100%'
    },
    card: {
        borderCurve: 'continuous',
        borderRadius: theme.radius.lg,
        borderWidth: StyleSheet.hairlineWidth,
        gap: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        width: '100%'
    },
    metaRow: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.md,
        justifyContent: 'space-between',
        width: '100%'
    },
    metaText: {
        fontSize: theme.typography.size.sm,
        fontWeight: '800',
        opacity: 0.48
    },
    metaValue: {
        fontWeight: '900',
        opacity: 1
    },
    controlsRow: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.xl,
        justifyContent: 'center',
        width: '100%'
    },
    navButton: {
        height: 52,
        width: 52
    },
    disabledButton: {
        opacity: 0.42
    }
}));
