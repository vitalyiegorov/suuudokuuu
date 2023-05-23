import { StyleSheet } from 'react-native';

import { CellSizeConstant } from '../../constants/dimensions.contant';
import { Colors } from '../theme';

// TODO: Add style theming support
export const CellStyles = StyleSheet.create({
    cell: {
        alignItems: 'center',
        borderColor: Colors.black,
        borderLeftWidth: 1,
        borderStyle: 'solid',
        borderTopWidth: 1,
        flex: 1,
        fontFamily: 'Inter_500Medium',
        height: CellSizeConstant,
        justifyContent: 'center',
        width: CellSizeConstant
    },
    cellActiveText: {
        color: Colors.cell.activeText
    },
    cellActiveValueText: {
        color: Colors.cell.activeValueText
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
        borderRightWidth: 1
    },
    cellLastRow: {
        borderBottomWidth: 1
    },
    cellText: {
        color: Colors.black,
        fontSize: 16
    }
});