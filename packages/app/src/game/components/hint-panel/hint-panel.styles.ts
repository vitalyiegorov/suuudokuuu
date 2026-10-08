import { appLayoutScreenIsWide } from '@suuudokuuu/ui';
import { StyleSheet } from 'react-native-unistyles';

import { isDefined } from '@rnw-community/shared';

import { GamePanelHorizontalPaddingConstant } from '../../constant/board-cell-size.constant';

const hintPanelMaxWidth = 480;
const hintPanelControlSize = 44;

export const HintPanelStyles = StyleSheet.create((theme, rt) => {
    const isWideLayout = appLayoutScreenIsWide(rt.screen);
    const dotSize = isWideLayout ? 8 : 6;
    const dotActiveSize = isWideLayout ? 10 : 8;

    return {
        region: (availableHeight: number | undefined) => ({
            bottom: isWideLayout ? 0 : rt.insets.bottom + theme.spacing.sm,
            ...(isDefined(availableHeight) && { height: availableHeight + theme.spacing.xs }),
            justifyContent: 'flex-end',
            left: isWideLayout ? 0 : GamePanelHorizontalPaddingConstant,
            paddingTop: isWideLayout ? 0 : theme.spacing.md,
            position: 'absolute',
            right: isWideLayout ? 0 : GamePanelHorizontalPaddingConstant,
            zIndex: 10
        }),
        container: (availableHeight: number | undefined) => ({
            alignSelf: 'center',
            borderCurve: 'continuous',
            borderRadius: theme.radius.lg,
            borderWidth: 1,
            gap: theme.spacing.sm,
            marginBottom: 'auto',
            maxWidth: hintPanelMaxWidth,
            padding: theme.spacing.md,
            width: '100%',
            ...(isDefined(availableHeight) && { maxHeight: availableHeight })
        }),
        controls: {
            alignItems: 'center',
            flexDirection: 'row',
            flexShrink: 0,
            gap: theme.spacing.xs,
            height: hintPanelControlSize,
            justifyContent: 'space-between'
        },
        actions: {
            flexDirection: 'row',
            gap: theme.spacing.sm,
            justifyContent: 'flex-end'
        },
        dismissButton: {
            borderRadius: hintPanelControlSize / 2,
            flexShrink: 0,
            height: hintPanelControlSize,
            width: hintPanelControlSize
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
        progressText: {
            color: theme.colors.text.primary,
            fontSize: 12,
            fontVariant: ['tabular-nums']
        },
        dot: {
            backgroundColor: theme.colors.text.hint,
            borderRadius: theme.radius.pill,
            height: dotSize,
            width: dotSize
        },
        dotActive: {
            backgroundColor: theme.colors.accent,
            borderRadius: theme.radius.pill,
            height: dotActiveSize,
            width: dotActiveSize
        },
        stepButton: {
            paddingHorizontal: 0,
            width: hintPanelControlSize
        }
    };
});
