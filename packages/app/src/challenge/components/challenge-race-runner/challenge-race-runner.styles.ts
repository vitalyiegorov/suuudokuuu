import { StyleSheet } from 'react-native';

export const ChallengeRaceRunnerStyles = StyleSheet.create({
    core: {
        borderRadius: 7,
        borderWidth: 2.5,
        height: 13,
        width: 13
    },
    halo: {
        borderRadius: 8,
        height: 16,
        position: 'absolute',
        width: 16
    },
    runner: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        marginLeft: -6.5,
        position: 'absolute',
        top: 0,
        width: 13
    }
});
