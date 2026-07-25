import { StyleSheet } from 'react-native';

import { BlackIconButtonSize } from '../black-icon-button/constant/black-icon-button-size.constant';

export const GlassIconButtonStyles = StyleSheet.create({
    glass: {
        borderRadius: BlackIconButtonSize / 2,
        height: BlackIconButtonSize,
        overflow: 'hidden',
        width: BlackIconButtonSize
    }
});
