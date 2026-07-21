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
        justifyContent: 'center',
        marginLeft: -9,
        position: 'absolute',
        top: -5,
        width: 18
    }
});
