import { StyleSheet } from 'react-native-unistyles';

export const ChallengeTimelineTrackStyles = StyleSheet.create({
    track: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 2,
        height: 28,
        paddingHorizontal: 8,
        position: 'relative',
        width: '100%'
    },
    baseline: {
        borderRadius: 1,
        height: 1.5,
        left: 8,
        marginTop: -0.75,
        opacity: 0.13,
        position: 'absolute',
        right: 8,
        top: '50%'
    },
    tick: {
        borderRadius: 2,
        flex: 1
    },
    awayTick: {
        alignSelf: 'stretch',
        borderRadius: 2,
        flex: 1,
        opacity: 0.16
    }
});
