import { StyleSheet } from 'react-native-unistyles';

export const ReplayControlsStyles = StyleSheet.create(theme => ({
    container: {
        alignSelf: 'center',
        gap: 16,
        maxWidth: theme.contentWidth.narrow,
        paddingBottom: 10,
        width: '100%'
    },
    metaRow: {
        alignItems: 'center',
        flexDirection: 'row',
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
        gap: 28,
        justifyContent: 'center',
        paddingTop: theme.spacing.xs,
        width: '100%'
    },
    navButton: {
        borderWidth: StyleSheet.hairlineWidth,
        height: 58,
        width: 58
    },
    disabledButton: {
        opacity: 0.42
    }
}));
