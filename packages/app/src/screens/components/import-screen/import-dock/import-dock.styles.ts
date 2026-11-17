import { StyleSheet } from 'react-native-unistyles';

import { ImportCompactFrameHeightConstant } from '../constants/import-compact-frame-height.constant';
import { ImportCompactPressHeightConstant } from '../constants/import-compact-press-height.constant';
import { ImportRegularPressHeightConstant } from '../constants/import-regular-press-height.constant';

export const ImportDockStyles = StyleSheet.create((theme, rt) => {
    const isCompact = rt.screen.height < ImportCompactFrameHeightConstant;

    return {
        dock: {
            alignSelf: 'center',
            flexShrink: 0,
            flexGrow: 1,
            flexBasis: 0,
            minHeight:
                (isCompact
                    ? ImportCompactPressHeightConstant * 4 + theme.spacing.md
                    : ImportRegularPressHeightConstant * 4 + theme.spacing.md) + rt.insets.bottom,
            maxWidth: '100%',
            paddingBottom: rt.insets.bottom + (isCompact ? theme.spacing.sm : theme.spacing.md)
        },
        playButton: {
            minHeight: isCompact ? ImportCompactPressHeightConstant : ImportRegularPressHeightConstant,
            paddingVertical: isCompact ? theme.spacing.sm : theme.spacing.md
        },
        buttonText: { _web: { lineHeight: 'normal' } },
        disabledButton: { opacity: 0.42 }
    };
});
