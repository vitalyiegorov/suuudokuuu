import { StyleSheet } from 'react-native';

import { Colors } from '../../../@generic/styles/theme';
import { CellFontSizeConstant, CellSizeConstant } from '../constants/dimensions.contant';

const progressHeight = 2;
const buttonSize = CellSizeConstant * 1.3;

export const AvailableValuesItemStyles = StyleSheet.create({
    button: {
        alignItems: 'center',
        borderBottomColor: Colors.value.progress,
        borderBottomWidth: progressHeight,
        borderColor: Colors.value.border,
        borderWidth: 1,
        height: buttonSize,
        justifyContent: 'center',
        width: buttonSize
    },
    container: {
        position: 'relative'
    },
    progress: {
        backgroundColor: Colors.cell.active,
        height: progressHeight,
        left: 0,
        position: 'absolute',
        top: buttonSize - progressHeight
    },
    text: {
        color: Colors.value.text,
        fontSize: CellFontSizeConstant
    },
    textActive: {
        color: Colors.cell.activeValueText
    },
    wrapperActive: {
        backgroundColor: Colors.cell.highlightedText
    }
});
