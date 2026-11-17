import { StyleSheet } from 'react-native-unistyles';

import { ImportCompactFrameHeightConstant } from '../constants/import-compact-frame-height.constant';

const narrowFrameWidth = 360;
const regularTitleSize = 22;

export const ImportHeaderStyles = StyleSheet.create((theme, rt) => {
    const isCompact = rt.screen.height < ImportCompactFrameHeightConstant;
    const resetHeight = 44;

    return {
        container: {
            alignItems: 'center',
            alignSelf: 'center',
            flexDirection: 'row',
            flexShrink: 0,
            gap: theme.spacing.sm,
            maxWidth: '100%',
            paddingTop: isCompact ? 0 : theme.spacing.xs
        },
        resetSlot: { width: 44, height: resetHeight },
        reset: {
            alignItems: 'flex-end',
            justifyContent: 'center',
            height: resetHeight,
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
            fontSize: rt.screen.width < narrowFrameWidth ? theme.typography.size.lg : regularTitleSize,
            marginBottom: 0,
            textAlign: 'auto'
        }
    };
});
