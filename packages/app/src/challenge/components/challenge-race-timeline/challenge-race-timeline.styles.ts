import { StyleSheet } from 'react-native';

export const ChallengeRaceTimelineStyles = StyleSheet.create({
    playerMarker: {
        borderRadius: 2,
        bottom: 6,
        marginLeft: -1.5,
        position: 'absolute',
        top: 6,
        width: 3
    },
    tick: {
        borderRadius: 2,
        flex: 1
    },
    track: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 3,
        height: 46,
        paddingHorizontal: 6,
        position: 'relative',
        width: '100%'
    }
});
