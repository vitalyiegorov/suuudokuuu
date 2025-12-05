import { StyleSheet } from 'react-native';

import { CellSizeConstant } from '../constants/dimensions.contant';

export const ReplayFieldCellStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        borderLeftWidth: 1,
        borderStyle: 'solid',
        borderTopWidth: 1,
        fontFamily: 'Inter_500Medium',
        height: CellSizeConstant,
        justifyContent: 'center',
        position: 'relative',
        width: CellSizeConstant
    },
    groupXEnd: {
        borderRightWidth: 1
    },
    groupYEnd: {
        borderBottomWidth: 1
    },
    lastCol: {
        borderRightWidth: 1
    },
    lastRow: {
        borderBottomWidth: 1
    }
});
