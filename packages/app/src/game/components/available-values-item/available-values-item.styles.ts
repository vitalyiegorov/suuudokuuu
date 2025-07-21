import { StyleSheet, Dimensions } from 'react-native';

import { Colors } from '../../../@generic/styles/theme';
import { CellFontSizeConstant } from '../constants/dimensions.contant';

const progressHeight = 2;
// Responsive button size as percentage of screen width
const { width } = Dimensions.get('window');
const buttonSize = Math.min(width * 0.12, 80); // ~12% of screen width, max 80px

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
