import { appLayoutScreenIsWide } from '@suuudokuuu/ui';
import { StyleSheet } from 'react-native-unistyles';

import { AppIconButtonSize } from '../../../../@generic/components/app-icon-button/constant/app-icon-button-size.constant';
import { BoardCellSizeMinConstant } from '../../../../game/constant/board-cell-size.constant';
import { PanelControlPillRadiusConstant, PanelControlWideSizeConstant } from '../../../../game/constant/panel-control-size.constant';

export const GameInputToolsStyles = StyleSheet.create((theme, rt) => ({
    inputControls: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        justifyContent: 'center'
    },
    row: {
        width: '100%'
    },
    toolButton: {
        borderRadius: PanelControlPillRadiusConstant,
        flexShrink: 1,
        height: appLayoutScreenIsWide(rt.screen) ? PanelControlWideSizeConstant : AppIconButtonSize,
        maxHeight: appLayoutScreenIsWide(rt.screen) ? PanelControlWideSizeConstant : AppIconButtonSize,
        maxWidth: appLayoutScreenIsWide(rt.screen) ? PanelControlWideSizeConstant : AppIconButtonSize,
        minHeight: appLayoutScreenIsWide(rt.screen) ? PanelControlWideSizeConstant : AppIconButtonSize,
        minWidth: BoardCellSizeMinConstant,
        width: appLayoutScreenIsWide(rt.screen) ? PanelControlWideSizeConstant : AppIconButtonSize
    }
}));
