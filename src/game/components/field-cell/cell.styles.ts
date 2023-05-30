import { StyleSheet } from 'react-native';

import { Colors } from '../../../@generic';
import { CellSizeConstant, CellFontSizeConstant } from '../../constants/dimensions.contant';

// TODO: Add style theming support
export const CellStyles = StyleSheet.create({
    cell: {
        alignItems: 'center',
        borderColor: Colors.black,
        borderLeftWidth: 1,
        borderStyle: 'solid',
        borderTopWidth: 1,
        fontFamily: 'Inter_500Medium',
        height: CellSizeConstant,
        justifyContent: 'center',
        width: CellSizeConstant
    },
    cellActiveText: {
        color: Colors.cell.activeText,
        fontWeight: 'bold'
    },
    cellActiveValueText: {
        color: Colors.cell.activeValueText,
        fontWeight: 'bold'
    },
    cellFirstCol: {
        borderLeftWidth: 3
    },

    cellFirstRow: {
        borderTopWidth: 3
    },
    cellGroupXEnd: {
        borderRightWidth: 2
    },
    cellGroupYEnd: {
        borderBottomWidth: 2
    },
    cellHighlightedText: {
        color: Colors.cell.highlightedText,
        fontSize: 16,
        fontWeight: 'bold'
    },
    cellLastCol: {
        borderRightWidth: 3
    },
    cellLastRow: {
        borderBottomWidth: 3
    },
    cellText: {
        color: Colors.black,
        fontSize: CellFontSizeConstant
    }
});
