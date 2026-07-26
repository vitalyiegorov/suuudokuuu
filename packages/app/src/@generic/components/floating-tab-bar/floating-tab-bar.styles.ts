import { StyleSheet } from 'react-native-unistyles';

import { FloatingTabBarRowPadding } from './constant/floating-tab-bar.constant';

export const FloatingTabBarStyles = StyleSheet.create(theme => ({
    anchor: {
        alignItems: 'center',
        left: 0,
        paddingHorizontal: theme.spacing.lg,
        position: 'absolute',
        right: 0,
        zIndex: 3
    },
    row: {
        flexDirection: 'row',
        gap: theme.spacing.xs,
        padding: FloatingTabBarRowPadding
    }
}));
