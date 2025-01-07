import { StyleSheet } from 'react-native';

import { Colors } from '../../../@generic/styles/theme';
import { CellFontSizeConstant } from '../constants/dimensions.contant';

export const FieldCellTextStyles = StyleSheet.create({
    active: {
        color: Colors.cell.activeText,
        fontWeight: 'bold'
    },
    activeValue: {
        color: Colors.cell.activeValueText
    },
    empty: {
        color: Colors.cell.emptyValueText
    },
    highlighted: {
        color: Colors.cell.highlightedText
    },
    regular: {
        color: Colors.black,
        fontSize: CellFontSizeConstant
    }
});
