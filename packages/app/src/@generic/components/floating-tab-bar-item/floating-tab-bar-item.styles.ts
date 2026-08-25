import { StyleSheet } from 'react-native-unistyles';

import { FloatingTabBarItemHeight, FloatingTabBarPillRadius } from '../floating-tab-bar/constant/floating-tab-bar.constant';

export const FloatingTabBarItemStyles = StyleSheet.create(theme => ({
    segment: {
        alignItems: 'center',
        borderRadius: FloatingTabBarPillRadius,
        flexBasis: 0,
        flexGrow: 1,
        flexShrink: 1,
        gap: theme.spacing.xs,
        justifyContent: 'center',
        minHeight: FloatingTabBarItemHeight,
        minWidth: 0,
        _web: {
            cursor: 'pointer',
            _hover: {
                opacity: 0.85
            }
        }
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        lineHeight: 16,
        textAlign: 'center'
    }
}));
