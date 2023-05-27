import { StyleSheet } from 'react-native';

import { Colors } from '../../src/@generic/styles/theme';

export const WinnerStyles = StyleSheet.create({
    boldText: {
        fontWeight: 'bold'
    },
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    scoreText: {
        color: Colors.black
    },
    timeText: {
        color: Colors.black,
        marginBottom: 20
    }
});
