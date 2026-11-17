import { Platform } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ImportCompactFrameHeightConstant } from '../constants/import-compact-frame-height.constant';

export const ImportStatusStyles = StyleSheet.create((theme, rt) => ({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        flexShrink: 0,
        gap: theme.spacing.sm,
        justifyContent: 'center',
        minHeight:
            rt.screen.height < ImportCompactFrameHeightConstant && Platform.OS === 'web'
                ? theme.typography.size.md + theme.spacing.xs / 2
                : 20,
        width: '100%'
    },
    icon: { width: 20, height: 20, flexShrink: 0 },
    status: {
        ...(rt.screen.height < ImportCompactFrameHeightConstant &&
            Platform.OS === 'web' && {
                lineHeight: theme.typography.size.md + theme.spacing.xs / 2
            }),
        flexShrink: 1,
        fontSize: theme.typography.size.md,
        fontWeight: '700',
        textAlign: 'center'
    }
}));
