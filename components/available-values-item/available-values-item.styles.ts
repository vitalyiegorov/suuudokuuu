import { StyleSheet } from 'react-native';

const tileSize = 40;
export const AvailableValuesItemStyles = StyleSheet.create({
    text: {},
    textActive: {
        color: 'white'
    },
    wrapper: {
        alignItems: 'center',
        borderWidth: 1,
        height: tileSize,
        justifyContent: 'center',
        width: tileSize
    },
    wrapperActive: {
        backgroundColor: 'green'
    }
});
