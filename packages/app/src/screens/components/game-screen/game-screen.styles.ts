import { StyleSheet } from 'react-native';

import { Colors } from '../../../@generic/styles/theme';

export const GameScreenStyles = StyleSheet.create({
    availableValuesWrapper: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center'
    },
    button: { paddingHorizontal: 10 },
    buttonsWrapper: { flexDirection: 'row', gap: 10 },
    container: {
        flex: 1,
        padding: 10,
        paddingBottom: 20
    },
    controls: {
        alignItems: 'flex-start',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    controlsWrapper: {
        alignItems: 'center'
    },
    headerText: {
        color: Colors.black
    },
    mistakesCountErrorText: {
        color: Colors.red,
        fontWeight: 'bold'
    },
    mistakesCountText: {
        color: Colors.black,
        fontWeight: 'bold'
    },
    mistakesMaxText: {
        color: Colors.black,
        fontWeight: 'bold'
    },
    mistakesSeparator: {
        marginHorizontal: 5
    },
    scoreText: {
        color: Colors.black,
        fontWeight: 'bold'
    },
    scoreWrapper: {
        alignItems: 'flex-end',
        minWidth: 80
    }
});
