import { Platform } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ImportCompactFrameHeightConstant } from '../constants/import-compact-frame-height.constant';

const narrowFrameWidth = 360;
const regularTitleSize = 22;

export const ImportHeaderStyles = StyleSheet.create((theme, rt) => {
    const isCompact = rt.screen.height < ImportCompactFrameHeightConstant;
    const resetHeight = 44;
    const isCompactWeb = isCompact && Platform.OS === 'web';

    return {
        container: {
            alignItems: 'center',
            alignSelf: 'center',
            flexDirection: 'row',
            flexShrink: 0,
            gap: theme.spacing.sm,
            maxWidth: '100%',
            ...(isCompactWeb && { height: resetHeight }),
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
            fontSize: isCompactWeb || rt.screen.width < narrowFrameWidth ? theme.typography.size.lg : regularTitleSize,
            ...(isCompactWeb && { lineHeight: resetHeight }),
            marginBottom: 0,
            textAlign: 'left'
        }
    };
});
