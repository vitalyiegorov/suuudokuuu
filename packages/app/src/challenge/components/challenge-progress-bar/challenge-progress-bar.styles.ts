import { StyleSheet } from 'react-native';

export const ChallengeProgressBarStyles = StyleSheet.create({
    opponentFill: {
        borderRadius: 4,
        height: '100%',
        left: 0,
        position: 'absolute',
        top: 0
    },
    playerMarker: {
        borderRadius: 2,
        bottom: -4,
        height: 16,
        marginLeft: -1.5,
        position: 'absolute',
        width: 3
    },
    raceArea: {
        height: 22,
        justifyContent: 'flex-end',
        position: 'relative',
        width: '100%'
    },
    track: {
        borderRadius: 4,
        height: 8,
        overflow: 'visible',
        position: 'relative',
        width: '100%'
    }
});
