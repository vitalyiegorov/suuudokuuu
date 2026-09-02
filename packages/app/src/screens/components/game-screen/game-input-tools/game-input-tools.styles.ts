import { appLayoutScreenIsWide } from '@suuudokuuu/ui';
import { StyleSheet } from 'react-native-unistyles';

import { AppIconButtonSize } from '../../../../@generic/components/app-icon-button/constant/app-icon-button-size.constant';
import { BoardCellSizeMinConstant } from '../../../../game/constant/board-cell-size.constant';
import { PanelControlPillRadiusConstant, PanelControlWideSizeConstant } from '../../../../game/constant/panel-control-size.constant';

const leftHandedThumbEdgeMargin = { marginEnd: 'auto' } as const;
const rightHandedThumbEdgeMargin = { marginStart: 'auto' } as const;

export const GameInputToolsStyles = StyleSheet.create((theme, rt) => ({
    inputControls: (isLeftHanded: boolean) => {
        const isWideLayout = appLayoutScreenIsWide(rt.screen);
        const narrowFlexDirection = isLeftHanded ? 'row-reverse' : 'row';

        return {
            alignItems: 'center',
            flexDirection: isWideLayout ? 'row' : narrowFlexDirection,
            gap: theme.spacing.sm,
            justifyContent: isWideLayout ? 'center' : 'flex-start',
            paddingHorizontal: isWideLayout ? 0 : theme.spacing.sm,
            width: '100%'
        };
    },
    toolButton: {
        borderRadius: PanelControlPillRadiusConstant,
        flexBasis: 0,
        flexGrow: 1,
        flexShrink: 1,
        height: appLayoutScreenIsWide(rt.screen) ? PanelControlWideSizeConstant : AppIconButtonSize,
        maxHeight: appLayoutScreenIsWide(rt.screen) ? PanelControlWideSizeConstant : AppIconButtonSize,
        maxWidth: appLayoutScreenIsWide(rt.screen) ? PanelControlWideSizeConstant : AppIconButtonSize,
        minHeight: appLayoutScreenIsWide(rt.screen) ? PanelControlWideSizeConstant : AppIconButtonSize,
        minWidth: BoardCellSizeMinConstant
    },
    primaryToolButton: (isLeftHanded: boolean) => {
        const isNarrowLayout = !appLayoutScreenIsWide(rt.screen);
        const thumbEdgeMargin = isLeftHanded ? leftHandedThumbEdgeMargin : rightHandedThumbEdgeMargin;

        return {
            borderRadius: PanelControlPillRadiusConstant,
            flexBasis: 0,
            flexGrow: 1,
            flexShrink: 1,
            height: PanelControlWideSizeConstant,
            maxHeight: PanelControlWideSizeConstant,
            maxWidth: PanelControlWideSizeConstant,
            minHeight: PanelControlWideSizeConstant,
            minWidth: BoardCellSizeMinConstant,
            ...(isNarrowLayout && thumbEdgeMargin)
        };
    }
}));
