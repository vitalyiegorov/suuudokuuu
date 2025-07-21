import { StyleSheet } from 'react-native';

import { Colors } from '../../../@generic/styles/theme';

const progressHeight = 2;

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
        maxHeight: 80,
        maxWidth: 80,
        minHeight: 35,
        minWidth: 35
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
        fontSize: 16
    },
    textActive: {
        color: Colors.cell.activeValueText
    },
    wrapperActive: {
        backgroundColor: Colors.cell.highlightedText
    }
});
