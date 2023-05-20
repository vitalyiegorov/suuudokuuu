import { StyleSheet } from 'react-native';

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
        fontWeight: 'bold'
    },
    mistakesText: {}
});
