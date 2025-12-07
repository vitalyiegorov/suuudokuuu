import { StyleSheet } from 'react-native';

export const ReplayHeaderStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: 8
    },
    titleRow: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center'
    },
    difficultyText: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    resultText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    wonText: {
        color: 'green'
    },
    lostText: {
        color: 'red'
    },
    statsRow: {
        flexDirection: 'row',
        gap: 16,
        justifyContent: 'center'
    },
    boldText: {
        fontWeight: 'bold'
    }
});
