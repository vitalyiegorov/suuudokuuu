import { StyleSheet } from 'react-native';

import { BlackIconButtonSize } from './constant/black-icon-button-size.constant';

export const BlackIconButtonStyles = StyleSheet.create({
    button: {
        borderRadius: BlackIconButtonSize / 2,
        height: BlackIconButtonSize,
        maxHeight: BlackIconButtonSize,
        maxWidth: BlackIconButtonSize,
        minHeight: BlackIconButtonSize,
        minWidth: BlackIconButtonSize,
        paddingHorizontal: 0,
        paddingVertical: 0,
        width: BlackIconButtonSize
    }
});
