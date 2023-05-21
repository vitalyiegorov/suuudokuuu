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
    mistakesCountText: {
        color: Colors.black,
        fontWeight: 'bold'
    },
    mistakesText: {
        color: Colors.black
    }
});
