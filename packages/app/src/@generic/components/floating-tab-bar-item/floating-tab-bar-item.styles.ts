import { StyleSheet } from 'react-native-unistyles';

import { FloatingTabBarItemHeight, FloatingTabBarPillRadius } from '../floating-tab-bar/constant/floating-tab-bar.constant';

export const FloatingTabBarItemStyles = StyleSheet.create(theme => ({
    segment: {
        alignItems: 'center',
        borderRadius: FloatingTabBarPillRadius,
        flexBasis: 'auto',
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
        fontFamily: theme.typography.fontFamily,
        fontSize: 10.5,
        letterSpacing: -0.16,
        lineHeight: 14,
        maxWidth: '100%',
        paddingHorizontal: 2,
        textAlign: 'center'
    }
}));
