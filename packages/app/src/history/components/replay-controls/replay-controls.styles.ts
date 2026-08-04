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
    scrubberTrack: {
        borderRadius: theme.radius.pill,
        height: 6,
        position: 'relative',
        width: '100%'
    },
    scrubberFill: {
        borderRadius: theme.radius.pill,
        bottom: 0,
        left: 0,
        position: 'absolute',
        top: 0
    },
    scrubberThumb: {
        borderRadius: 11,
        borderWidth: 2,
        height: 22,
        marginLeft: -11,
        position: 'absolute',
        top: -8,
        width: 22
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
