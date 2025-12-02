import { StyleSheet } from 'react-native';

export const ChallengeProgressBarStyles = StyleSheet.create({
    container: {
        marginBottom: 8,
        paddingHorizontal: 10,
        width: '100%'
    },
    opponentProgress: {
        borderRadius: 2,
        height: '100%',
        left: 0,
        position: 'absolute',
        top: 0
    },
    playerProgress: {
        borderRadius: 2,
        bottom: 0,
        height: 4,
        left: 0,
        position: 'absolute'
    },
    stepIndicator: {
        borderRadius: 1,
        height: 6,
        marginTop: -1,
        position: 'absolute',
        width: 2
    },
    track: {
        borderRadius: 2,
        height: 4,
        overflow: 'visible',
        position: 'relative',
        width: '100%'
    }
});
