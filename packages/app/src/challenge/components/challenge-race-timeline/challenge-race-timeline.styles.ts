import { StyleSheet } from 'react-native';

export const ChallengeRaceTimelineStyles = StyleSheet.create({
    fill: {
        borderRadius: 2,
        height: 2,
        left: 0,
        marginTop: -1,
        opacity: 0.22,
        position: 'absolute',
        top: '50%'
    },
    overlay: {
        bottom: 0,
        left: 12,
        position: 'absolute',
        right: 12,
        top: 0
    },
    playerMarker: {
        borderRadius: 2,
        bottom: 5,
        marginLeft: -1.5,
        position: 'absolute',
        top: 5,
        width: 3
    },
    tick: {
        borderRadius: 2,
        flex: 1
    },
    track: {
        alignItems: 'center',
        borderRadius: 11,
        flexDirection: 'row',
        gap: 2,
        height: 28,
        overflow: 'hidden',
        paddingHorizontal: 12,
        position: 'relative',
        width: '100%'
    }
});
