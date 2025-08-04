import { StyleSheet } from 'react-native';

import { CellSizeConstant } from '../constants/dimensions.contant';

export const FieldCellStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        borderLeftWidth: 1,
        borderStyle: 'solid',
        borderTopWidth: 1,
        fontFamily: 'Inter_500Medium',
        height: CellSizeConstant,
        justifyContent: 'center',
        outlineOffset: 0,
        outlineWidth: 0,
        position: 'relative',
        width: CellSizeConstant
    },
    groupXEnd: {
        borderRightWidth: 1,
        marginRight: 5
    },
    groupYEnd: {
        borderBottomWidth: 1,
        marginBottom: 5
    },
    lastCol: {
        borderRightWidth: 1
    },
    lastRow: {
        borderBottomWidth: 1
    }
});
