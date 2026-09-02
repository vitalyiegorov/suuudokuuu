import { appLayoutScreenIsWide } from '@suuudokuuu/ui';
import { StyleSheet } from 'react-native-unistyles';

import { AppIconButtonSize } from '../../../../@generic/components/app-icon-button/constant/app-icon-button-size.constant';
import { GamePanelHorizontalPaddingConstant } from '../../../../game/constant/board-cell-size.constant';
import { PanelControlPillRadiusConstant, PanelControlPrimarySizeConstant } from '../../../../game/constant/panel-control-size.constant';
import { gameGetNumpadRowWidth } from '../../../../game/utils/game-get-numpad-row-width.util';

import { GameInputToolsMinRowWidthConstant, GameInputToolsWideSizeConstant } from './constant/game-input-tools.constant';

export const GameInputToolsStyles = StyleSheet.create((theme, rt) => ({
    inputControls: (isLeftHanded: boolean) => {
        const isWideLayout = appLayoutScreenIsWide(rt.screen);
        const narrowFlexDirection = isLeftHanded ? 'row-reverse' : 'row';
        const panelInnerWidth = rt.screen.width - GamePanelHorizontalPaddingConstant * 2;
        const narrowRowWidth = Math.min(
            panelInnerWidth,
            Math.max(gameGetNumpadRowWidth(rt.screen.width), GameInputToolsMinRowWidthConstant)
        );

        return {
            alignItems: 'center',
            alignSelf: 'center',
            flexDirection: isWideLayout ? 'row' : narrowFlexDirection,
            gap: theme.spacing.sm,
            justifyContent: isWideLayout ? 'center' : 'space-between',
            width: isWideLayout ? '100%' : narrowRowWidth
        };
    },
    utilityGroup: {
        alignItems: 'center',
        flexDirection: 'row',
        flexShrink: 0,
        gap: theme.spacing.sm
    },
    toolButton: {
        borderRadius: PanelControlPillRadiusConstant,
        height: appLayoutScreenIsWide(rt.screen) ? GameInputToolsWideSizeConstant : AppIconButtonSize,
        width: appLayoutScreenIsWide(rt.screen) ? GameInputToolsWideSizeConstant : AppIconButtonSize
    },
    primaryToolButton: {
        borderRadius: PanelControlPillRadiusConstant,
        height: appLayoutScreenIsWide(rt.screen) ? GameInputToolsWideSizeConstant : PanelControlPrimarySizeConstant,
        width: appLayoutScreenIsWide(rt.screen) ? GameInputToolsWideSizeConstant : PanelControlPrimarySizeConstant
    }
}));
