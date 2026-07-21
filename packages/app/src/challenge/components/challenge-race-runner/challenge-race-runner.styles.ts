import { StyleSheet } from 'react-native';

export const ChallengeRaceRunnerStyles = StyleSheet.create({
    core: {
        borderRadius: 5,
        height: 10,
        width: 10
    },
    halo: {
        borderRadius: 9,
        height: 18,
        position: 'absolute',
        width: 18
    },
    runner: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        marginLeft: -9,
        position: 'absolute',
        top: 0,
        width: 18
    }
});
