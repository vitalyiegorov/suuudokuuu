import { StyleSheet } from 'react-native';

import { FloatingTabBarMaxWidth, FloatingTabBarPillRadius } from '../floating-tab-bar/constant/floating-tab-bar.constant';

export const FloatingTabBarSurfaceStyles = StyleSheet.create({
    pill: {
        borderCurve: 'continuous',
        borderRadius: FloatingTabBarPillRadius,
        borderWidth: 1,
        maxWidth: FloatingTabBarMaxWidth,
        overflow: 'hidden',
        width: '100%'
    }
});
