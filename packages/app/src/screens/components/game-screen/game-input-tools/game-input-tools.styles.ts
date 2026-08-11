import { appLayoutScreenIsWide } from '@suuudokuuu/ui';
import { StyleSheet } from 'react-native-unistyles';

import { AppIconButtonSize } from '../../../../@generic/components/app-icon-button/constant/app-icon-button-size.constant';
import { PanelControlPillRadiusConstant, PanelControlWideSizeConstant } from '../../../../game/constant/panel-control-size.constant';

export const GameInputToolsStyles = StyleSheet.create((theme, rt) => ({
    inputControls: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        justifyContent: 'center'
    },
    ratingBadgeSlot: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        right: 0,
        top: 0
    },
    row: {
        width: '100%'
    },
    toolButton: {
        borderRadius: PanelControlPillRadiusConstant,
        height: appLayoutScreenIsWide(rt.screen) ? PanelControlWideSizeConstant : AppIconButtonSize,
        maxHeight: appLayoutScreenIsWide(rt.screen) ? PanelControlWideSizeConstant : AppIconButtonSize,
        maxWidth: appLayoutScreenIsWide(rt.screen) ? PanelControlWideSizeConstant : AppIconButtonSize,
        minHeight: appLayoutScreenIsWide(rt.screen) ? PanelControlWideSizeConstant : AppIconButtonSize,
        minWidth: appLayoutScreenIsWide(rt.screen) ? PanelControlWideSizeConstant : AppIconButtonSize,
        width: appLayoutScreenIsWide(rt.screen) ? PanelControlWideSizeConstant : AppIconButtonSize
    }
}));
