import { StyleSheet } from 'react-native';

import { FloatingTabBarMaxWidth, FloatingTabBarPillRadius } from '../floating-tab-bar/constant/floating-tab-bar.constant';

export const FloatingTabBarSurfaceStyles = StyleSheet.create({
    pill: {
        borderRadius: FloatingTabBarPillRadius,
        borderWidth: StyleSheet.hairlineWidth,
        maxWidth: FloatingTabBarMaxWidth,
        overflow: 'hidden',
        width: '100%'
    }
});
