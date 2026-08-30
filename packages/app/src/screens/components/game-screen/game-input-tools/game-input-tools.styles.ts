import { appLayoutScreenIsWide } from '@suuudokuuu/ui';
import { StyleSheet } from 'react-native-unistyles';

import { AppIconButtonSize } from '../../../../@generic/components/app-icon-button/constant/app-icon-button-size.constant';
import { BoardCellSizeMinConstant } from '../../../../game/constant/board-cell-size.constant';
import { PanelControlPillRadiusConstant, PanelControlWideSizeConstant } from '../../../../game/constant/panel-control-size.constant';

export const GameInputToolsStyles = StyleSheet.create((theme, rt) => ({
    inputControls: (isLeftHanded: boolean) => {
        const isWideLayout = appLayoutScreenIsWide(rt.screen);
        const narrowFlexDirection = isLeftHanded ? 'row-reverse' : 'row';

        return {
            flexDirection: isWideLayout ? 'row' : narrowFlexDirection,
            gap: theme.spacing.sm,
            justifyContent: 'center',
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
    primaryToolButton: {
        borderRadius: PanelControlPillRadiusConstant,
        flexBasis: 0,
        flexGrow: 1,
        flexShrink: 1,
        height: PanelControlWideSizeConstant,
        maxHeight: PanelControlWideSizeConstant,
        maxWidth: PanelControlWideSizeConstant,
        minHeight: PanelControlWideSizeConstant,
        minWidth: BoardCellSizeMinConstant
    }
}));
