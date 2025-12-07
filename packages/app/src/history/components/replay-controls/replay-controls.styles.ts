import { StyleSheet } from 'react-native';

export const ReplayControlsStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: 12
    },
    timeContainer: {
        alignItems: 'center'
    },
    controlsRow: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24
    },
    navButton: {
        paddingVertical: 12,
        paddingHorizontal: 16
    },
    navButtonPlaceholder: {
        width: 60,
        height: 52
    },
    stepCounterContainer: {
        alignItems: 'center',
        minWidth: 80
    },
    stepCounter: {
        fontSize: 18,
        textAlign: 'center'
    },
    stepLabel: {
        fontSize: 12,
        opacity: 0.7
    },
    boldText: {
        fontWeight: 'bold'
    }
});
