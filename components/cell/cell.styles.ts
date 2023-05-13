import { StyleSheet } from 'react-native';

export const cellSize = 50;

export const CellStyles = StyleSheet.create({
    cell: {
        alignItems: 'center',
        borderColor: 'black',
        borderLeftWidth: 1,
        borderStyle: 'solid',
        borderTopWidth: 1,
        flex: 1,
        height: cellSize,
        justifyContent: 'center',
        width: cellSize
    },
    cellLastGroup: {
        borderRightWidth: 2
    },
    cellLastRow: {
        borderBottomWidth: 1
    }
});
