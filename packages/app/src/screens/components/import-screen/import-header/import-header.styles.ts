import { StyleSheet } from 'react-native-unistyles';

import { ImportCompactFrameHeightConstant } from '../constants/import-compact-frame-height.constant';

const narrowFrameWidth = 360;

export const ImportHeaderStyles = StyleSheet.create((theme, rt) => ({
    container: {
        alignItems: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
        flexShrink: 0,
        gap: theme.spacing.sm,
        maxWidth: '100%',
        paddingTop: rt.screen.height < ImportCompactFrameHeightConstant ? 0 : theme.spacing.xs
    },
    resetSlot: { width: 44, height: 44 },
    reset: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        height: 44,
        width: 44,
        borderRadius: theme.radius.sm,
        _web: {
            cursor: 'pointer'
        }
    },
    resetPressed: {
        opacity: 0.6,
        transform: [{ scale: 0.97 }]
    },
    title: {
        flex: 1,
        fontSize: rt.screen.width < narrowFrameWidth ? theme.typography.size.lg : 22,
        marginBottom: 0,
        textAlign: 'left'
    }
}));
