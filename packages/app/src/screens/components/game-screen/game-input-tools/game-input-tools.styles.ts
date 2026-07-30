import { appLayoutScreenIsWide } from '@suuudokuuu/ui';
import { StyleSheet } from 'react-native-unistyles';

import { BlackIconButtonSize } from '../../../../@generic/components/black-icon-button/constant/black-icon-button-size.constant';
import { PanelControlPillRadiusConstant, PanelControlWideSizeConstant } from '../../../../game/constant/panel-control-size.constant';

export const GameInputToolsStyles = StyleSheet.create((theme, rt) => ({
    inputControls: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        justifyContent: 'center'
    },
    toolButton: {
        borderRadius: PanelControlPillRadiusConstant,
        height: appLayoutScreenIsWide(rt.screen) ? PanelControlWideSizeConstant : BlackIconButtonSize,
        maxHeight: appLayoutScreenIsWide(rt.screen) ? PanelControlWideSizeConstant : BlackIconButtonSize,
        maxWidth: appLayoutScreenIsWide(rt.screen) ? PanelControlWideSizeConstant : BlackIconButtonSize,
        minHeight: appLayoutScreenIsWide(rt.screen) ? PanelControlWideSizeConstant : BlackIconButtonSize,
        minWidth: appLayoutScreenIsWide(rt.screen) ? PanelControlWideSizeConstant : BlackIconButtonSize,
        width: appLayoutScreenIsWide(rt.screen) ? PanelControlWideSizeConstant : BlackIconButtonSize
    }
}));
