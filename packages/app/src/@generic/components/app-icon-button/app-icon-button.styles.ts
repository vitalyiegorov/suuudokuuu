import { StyleSheet } from 'react-native';

import { AppIconButtonSize } from './constant/app-icon-button-size.constant';

export const AppIconButtonStyles = StyleSheet.create({
    button: {
        borderRadius: AppIconButtonSize / 2,
        height: AppIconButtonSize,
        paddingHorizontal: 0,
        width: AppIconButtonSize
    }
});
