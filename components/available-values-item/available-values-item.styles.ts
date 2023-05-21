import { StyleSheet } from 'react-native';

import { CellSizeConstant } from '../../constants/dimensions.contant';
import { Colors } from '../theme';

export const AvailableValuesItemStyles = StyleSheet.create({
    button: {
        alignItems: 'center',
        borderBottomColor: Colors.black,
        borderColor: Colors.cell.highlighted,
        borderWidth: 1,
        height: CellSizeConstant,
        justifyContent: 'center',
        width: CellSizeConstant
    },
    container: {
        position: 'relative'
    },
    progress: {
        backgroundColor: 'green',
        height: 2,
        left: 0,
        position: 'absolute',
        top: CellSizeConstant - 2,
        zIndex: 5
    },
    text: { color: Colors.black },
    textActive: {
        color: Colors.cell.activeValueText
    },
    wrapperActive: {
        backgroundColor: Colors.cell.highlightedText
    }
});
