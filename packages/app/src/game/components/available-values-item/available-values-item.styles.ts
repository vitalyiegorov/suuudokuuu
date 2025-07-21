import { Dimensions, StyleSheet } from 'react-native';

import { Colors } from '../../../@generic/styles/theme';

const progressHeight = 2;
const minButtonSize = 35;
const maxButtonSize = 80;
const buttonSizeRatio = 0.12;
const minFontSize = 14;
const maxFontSize = 20;
const fontSizeRatio = 0.04;

const { width: screenWidth } = Dimensions.get('window');

/*
 * Calculate button size as percentage of screen width for responsiveness
 */
const buttonSize = Math.max(minButtonSize, Math.min(maxButtonSize, screenWidth * buttonSizeRatio));

export const AvailableValuesItemStyles = StyleSheet.create({
    button: {
        alignItems: 'center',
        aspectRatio: 1,
        borderBottomColor: Colors.value.progress,
        borderBottomWidth: progressHeight,
        borderColor: Colors.value.border,
        borderWidth: 1,
        flex: 1,
        justifyContent: 'center',
        maxHeight: buttonSize,
        maxWidth: buttonSize,
        minHeight: minButtonSize,
        minWidth: minButtonSize
    },
    container: {
        position: 'relative'
    },
    progress: {
        backgroundColor: Colors.cell.active,
        bottom: 0,
        height: progressHeight,
        left: 0,
        position: 'absolute'
    },
    text: {
        color: Colors.value.text,
        fontSize: Math.max(minFontSize, Math.min(maxFontSize, screenWidth * fontSizeRatio))
    },
    textActive: {
        color: Colors.cell.activeValueText
    },
    wrapperActive: {
        backgroundColor: Colors.cell.highlightedText
    }
});
