import { StyleSheet } from 'react-native';

export const ReplayControlsStyles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        gap: 16,
        maxWidth: 380,
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
        fontSize: 14,
        fontWeight: '800',
        opacity: 0.48
    },
    metaValue: {
        fontWeight: '900',
        opacity: 1
    },
    scrubberTrack: {
        borderRadius: 999,
        height: 6,
        position: 'relative',
        width: '100%'
    },
    scrubberFill: {
        borderRadius: 999,
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
        paddingTop: 4,
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
});
