import { appLayoutScreenIsWide } from '@suuudokuuu/ui';
import { StyleSheet } from 'react-native-unistyles';

import { HintPanelWideMaxWidthConstant } from './constant/hint-panel.constant';

export const HintPanelStyles = StyleSheet.create((theme, rt) => {
    const isWideLayout = appLayoutScreenIsWide(rt.screen);
    const edgeInset = isWideLayout ? theme.spacing.lg : theme.spacing.sm;

    return {
        container: {
            borderCurve: 'continuous',
            borderRadius: isWideLayout ? theme.radius.lg : theme.radius.md,
            borderWidth: 1,
            bottom: rt.insets.bottom / 2 + edgeInset,
            gap: isWideLayout ? theme.spacing.md : theme.spacing.sm,
            left: edgeInset,
            padding: isWideLayout ? theme.spacing.lg : theme.spacing.sm,
            position: 'absolute',
            right: edgeInset,
            zIndex: 10,
            ...(isWideLayout && { marginHorizontal: 'auto', maxWidth: HintPanelWideMaxWidthConstant })
        },
        content: {
            alignItems: 'flex-start',
            flexDirection: 'row',
            gap: isWideLayout ? theme.spacing.sm : theme.spacing.xs
        },
        dismissButton: {
            flexShrink: 0
        },
        controls: {
            alignItems: 'center',
            flexDirection: 'row',
            gap: theme.spacing.xs,
            justifyContent: 'space-between'
        },
        stepControls: {
            alignItems: 'center',
            flexDirection: 'row',
            gap: theme.spacing.xs
        },
        dots: {
            alignItems: 'center',
            flexDirection: 'row',
            gap: theme.spacing.xs / 2
        },
        dot: {
            backgroundColor: theme.colors.text.hint,
            borderRadius: theme.radius.pill,
            height: isWideLayout ? 8 : 6,
            width: isWideLayout ? 8 : 6
        },
        dotActive: {
            backgroundColor: theme.colors.accent,
            borderRadius: theme.radius.pill,
            height: isWideLayout ? 10 : 8,
            width: isWideLayout ? 10 : 8
        },
        stepButton: {
            minWidth: 44
        }
    };
});
