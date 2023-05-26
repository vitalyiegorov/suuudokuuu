import { StyleSheet } from 'react-native';

import { Colors } from '../../components/theme';

export const GameStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    controls: {
        alignItems: 'center',
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
