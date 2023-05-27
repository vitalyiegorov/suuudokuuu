import { StyleSheet } from 'react-native';

import { Colors } from '../src/@generic';

export const StartScreenStyles = StyleSheet.create({
    backButton: {
        marginTop: 20
    },
    bottomContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    bottomLink: {
        color: Colors.black
    },
    buttonWrapper: {
        gap: 10
    },
    centerContainer: {
        alignItems: 'center',
        flex: 3,
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    historyContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1,
        gap: 20,
        justifyContent: 'center'
    },
    historyGroup: {
        alignItems: 'center'
    },
    historyLabel: {
        color: Colors.black
    },
    historyValue: {
        color: Colors.black,
        fontWeight: 'bold'
    }
});
