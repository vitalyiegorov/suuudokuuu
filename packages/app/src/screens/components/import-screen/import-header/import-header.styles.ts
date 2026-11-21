import { StyleSheet } from 'react-native-unistyles';

import { ImportCompactFrameHeightConstant } from '../constants/import-compact-frame-height.constant';
import { ImportHeaderHeightConstant } from '../constants/import-header-height.constant';

const narrowFrameWidth = 360;
const regularTitleSize = 22;
const resetSize = 44;

export const ImportHeaderStyles = StyleSheet.create((theme, rt) => {
    const isCompact = rt.screen.height < ImportCompactFrameHeightConstant;

    return {
        container: {
            alignItems: 'center',
            alignSelf: 'center',
            flexDirection: 'row',
            flexShrink: 0,
            height: ImportHeaderHeightConstant - (isCompact ? theme.spacing.md : 0),
            maxWidth: '100%',
            paddingTop: isCompact ? 0 : theme.spacing.sm
        },
        resetSlot: { flexShrink: 0, height: resetSize, width: resetSize },
        reset: {
            alignItems: 'flex-start',
            height: resetSize,
            justifyContent: 'center',
            width: resetSize,
            _web: {
                cursor: 'pointer'
            }
        },
        resetPressed: {
            opacity: 0.6
        },
        title: {
            flex: 1,
            fontSize: rt.screen.width < narrowFrameWidth ? theme.typography.size.lg : regularTitleSize,
            marginBottom: 0,
            textAlign: 'auto'
        }
    };
});
