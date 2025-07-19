import { StyleSheet } from 'react-native';

import { Colors } from '../../../@generic/styles/theme';

export const WinnerScreenStyles = StyleSheet.create({
    boldText: {
        fontWeight: 'bold'
    },
    container: {
        alignItems: 'center',
        flex: 1,
        gap: 20,
        justifyContent: 'center'
    },
    scoreText: {
        color: Colors.black
    },
    timeText: {
        color: Colors.black
    }
});
