import { StyleSheet } from 'react-native';

export const ReplayScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        gap: 16
    },
    fieldWrapper: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    infoContainer: {
        alignItems: 'center',
        gap: 8
    },
    controlsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16
    },
    stepCounter: {
        minWidth: 80,
        textAlign: 'center'
    },
    boldText: {
        fontWeight: 'bold'
    },
    statsRow: {
        flexDirection: 'row',
        gap: 24,
        justifyContent: 'center'
    }
});
