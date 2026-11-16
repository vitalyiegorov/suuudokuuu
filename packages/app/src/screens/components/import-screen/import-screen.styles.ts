import { MaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import { StyleSheet } from 'react-native-unistyles';

import { ImportCompactFrameHeightConstant } from './constants/import-compact-frame-height.constant';

const statusContentHeight = 56;
const compactGap = 6;

export const ImportScreenStyles = StyleSheet.create((theme, rt) => {
    const isCompact = rt.screen.height < ImportCompactFrameHeightConstant;
    const statusInset = isCompact ? theme.spacing.xs : theme.spacing.sm;

    return {
        content: { alignSelf: 'center', maxWidth: '100%' },
        sourcesContent: { paddingVertical: theme.spacing.md },
        scroll: { flexGrow: 1, flexBasis: 0, flexShrink: 1, minHeight: 0 },
        boardScroll: { flexGrow: 0, flexShrink: 1, minHeight: 0 },
        statusSlot: {
            alignSelf: 'center',
            flexShrink: 0,
            gap: theme.spacing.xs,
            height: statusInset + statusContentHeight * Math.min(rt.fontScale, MaxFontSizeMultiplierConstant) + theme.spacing.xs,
            maxWidth: '100%',
            paddingTop: statusInset
        },
        sourceStatus: { alignItems: 'center', gap: theme.spacing.xs },
        spare: { flexBasis: 0, flexGrow: 1, flexShrink: 1, maxHeight: theme.spacing.xxl },
        dock: {
            alignSelf: 'center',
            flexShrink: 0,
            gap: isCompact ? compactGap : theme.spacing.sm,
            maxWidth: '100%',
            paddingBottom: rt.insets.bottom + (isCompact ? theme.spacing.sm : theme.spacing.md)
        },
        playButton: {
            minHeight: isCompact ? 44 : 52,
            paddingVertical: isCompact ? theme.spacing.sm : theme.spacing.md
        },
        buttonText: { _web: { lineHeight: 'normal' } },
        disabledButton: {
            opacity: 0.42
        }
    };
});
