import { StyleSheet } from 'react-native';

import { Colors } from '../theme';

const tileSize = 40;
export const AvailableValuesItemStyles = StyleSheet.create({
    text: { color: Colors.black },
    textActive: {
        color: Colors.cell.activeValueText
    },
    wrapper: {
        alignItems: 'center',
        borderColor: Colors.black,
        borderWidth: 1,
        height: tileSize,
        justifyContent: 'center',
        width: tileSize
    },
    wrapperActive: {
        backgroundColor: Colors.cell.highlightedText
    }
});
