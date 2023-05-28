import { StyleSheet } from 'react-native';

import { Colors } from '../../../@generic';

export const GameScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
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
    mistakesCountText: {
        color: Colors.black,
        fontWeight: 'bold'
    },
    scoreText: {
        color: Colors.black,
        fontWeight: 'bold'
    }
});
