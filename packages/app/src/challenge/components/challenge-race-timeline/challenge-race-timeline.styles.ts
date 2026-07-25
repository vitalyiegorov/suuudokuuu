import { StyleSheet } from 'react-native';

export const ChallengeRaceTimelineStyles = StyleSheet.create({
    baseline: {
        borderRadius: 1,
        height: 1.5,
        left: 0,
        marginTop: -0.75,
        opacity: 0.13,
        position: 'absolute',
        right: 0,
        top: '50%'
    },
    baselineLayer: {
        bottom: 0,
        left: 8,
        position: 'absolute',
        right: 8,
        top: 0
    },
    fill: {
        borderRadius: 2,
        height: 2,
        left: 0,
        marginTop: -1,
        opacity: 0.28,
        position: 'absolute',
        top: '50%'
    },
    gap: {
        borderRadius: 2,
        height: 3,
        marginTop: -1.5,
        opacity: 0.85,
        position: 'absolute',
        top: '50%'
    },
    overlay: {
        bottom: 0,
        left: 8,
        position: 'absolute',
        right: 8,
        top: 0
    },
    playerDot: {
        borderRadius: 6.5,
        borderWidth: 2.5,
        height: 13,
        marginLeft: -6.5,
        marginTop: -6.5,
        position: 'absolute',
        top: '50%',
        width: 13
    },
    tick: {
        borderRadius: 2,
        flex: 1
    },
    track: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 2,
        height: 28,
        paddingHorizontal: 8,
        position: 'relative',
        width: '100%'
    }
});
