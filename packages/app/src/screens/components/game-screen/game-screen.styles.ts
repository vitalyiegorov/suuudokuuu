import { StyleSheet } from 'react-native';

import { Colors } from '../../../@generic/styles/theme';

export const GameScreenStyles = StyleSheet.create({
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
    }
});
