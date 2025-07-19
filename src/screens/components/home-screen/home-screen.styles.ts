import { StyleSheet } from 'react-native';

import { Colors } from '../../../@generic/styles/theme';

export const HomeScreenStyles = StyleSheet.create({
    bottomContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 20
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
