import { StyleSheet } from 'react-native-unistyles';

import { AvailableValueButtonSize } from './constant/available-value-button.constant';

export const AvailableValuesItemStyles = StyleSheet.create(() => ({
    button: {
        alignItems: 'center',
        borderRadius: AvailableValueButtonSize / 2,
        height: AvailableValueButtonSize,
        justifyContent: 'center',
        outlineOffset: 0,
        outlineWidth: 0,
        overflow: 'visible',
        position: 'relative',
        width: AvailableValueButtonSize
    },
    container: {
        position: 'relative'
    },
    exhausted: {
        opacity: 0.35
    },
    progressRing: {
        left: 0,
        top: 0,
        position: 'absolute'
    },
    text: {
        zIndex: 1
    }
}));
