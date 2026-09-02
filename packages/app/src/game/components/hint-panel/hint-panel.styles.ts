import { appLayoutScreenIsWide } from '@suuudokuuu/ui';
import { StyleSheet } from 'react-native-unistyles';

import { GamePanelHorizontalPaddingConstant, GameSidePanelWidthConstant } from '../../constant/board-cell-size.constant';
import {
    HintControlRowHeightConstant,
    HintSurfaceNarrowGapConstant,
    HintSurfaceNarrowPaddingConstant,
    HintSurfaceWideGapConstant,
    HintSurfaceWidePaddingConstant
} from '../../constant/hint-surface.constant';

const hintPanelWideWidthRatio = 1.5;
const hintPanelWideMaxWidth = GameSidePanelWidthConstant * hintPanelWideWidthRatio;
const hintPanelDismissSize = HintControlRowHeightConstant;

export const HintPanelStyles = StyleSheet.create((theme, rt) => {
    const isWideLayout = appLayoutScreenIsWide(rt.screen);
    const dotSize = isWideLayout ? 8 : 6;
    const dotActiveSize = isWideLayout ? 10 : 8;

    return {
        container: (surfaceHeight: number) => ({
            borderCurve: 'continuous',
            borderRadius: theme.radius.lg,
            borderWidth: 1,
            bottom: isWideLayout ? rt.insets.bottom / 2 + theme.spacing.lg : 0,
            gap: isWideLayout ? HintSurfaceWideGapConstant : HintSurfaceNarrowGapConstant,
            height: surfaceHeight,
            left: isWideLayout ? theme.spacing.lg : GamePanelHorizontalPaddingConstant,
            padding: isWideLayout ? HintSurfaceWidePaddingConstant : HintSurfaceNarrowPaddingConstant,
            position: 'absolute',
            right: isWideLayout ? theme.spacing.lg : GamePanelHorizontalPaddingConstant,
            zIndex: 10,
            ...(isWideLayout && { marginHorizontal: 'auto', maxWidth: hintPanelWideMaxWidth })
        }),
        controls: {
            alignItems: 'center',
            flexDirection: 'row',
            flexShrink: 0,
            gap: theme.spacing.sm,
            height: HintControlRowHeightConstant,
            justifyContent: 'space-between'
        },
        dismissButton: {
            borderRadius: hintPanelDismissSize / 2,
            flexShrink: 0,
            height: hintPanelDismissSize,
            width: hintPanelDismissSize
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
            minWidth: 44
        }
    };
});
