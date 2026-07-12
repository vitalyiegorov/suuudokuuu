import { StyleSheet } from 'react-native';

export const ChallengeResultScreenStyles = StyleSheet.create({
    boldText: {
        fontWeight: 'bold'
    },
    container: {
        alignItems: 'center',
        flex: 1,
        gap: 20,
        justifyContent: 'center'
    },
    differenceText: {
        marginTop: 4
    },
    icon: {
        marginBottom: 10
    },
    metricsGrid: {
        gap: 10,
        maxWidth: 360,
        width: '100%'
    },
    metricsRow: {
        flexDirection: 'row',
        gap: 10
    },
    messageText: {
        marginTop: 2
    },
    statsContainer: {
        alignItems: 'center',
        gap: 10,
        width: '100%'
    }
});
