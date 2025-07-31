import { StyleSheet } from 'react-native';

export const HomeScreenStyles = StyleSheet.create({
    bottomContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 20
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
    historyValue: {
        fontWeight: 'bold'
    },
    separator: {
        borderTopWidth: 1,
        marginVertical: 10
    },
    themeButton: {
        height: 40,
        justifyContent: 'center',
        position: 'absolute',
        right: 10,
        top: 0,
        width: 40,
        zIndex: 99
    }
});
