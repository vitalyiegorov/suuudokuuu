import { StyleSheet } from 'react-native';

import { AppIconButtonSize } from '../app-icon-button/constant/app-icon-button-size.constant';

export const GlassIconButtonStyles = StyleSheet.create({
    glass: {
        borderRadius: AppIconButtonSize / 2,
        height: AppIconButtonSize,
        overflow: 'hidden',
        width: AppIconButtonSize
    }
});
