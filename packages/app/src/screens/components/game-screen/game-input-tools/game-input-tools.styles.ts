import { appLayoutScreenIsWide } from '@suuudokuuu/ui';
import { StyleSheet } from 'react-native-unistyles';

import { AppIconButtonSize } from '../../../../@generic/components/app-icon-button/constant/app-icon-button-size.constant';
import { GamePanelHorizontalPaddingConstant, GamePanelWideRowWidthConstant } from '../../../../game/constant/board-cell-size.constant';
import { PanelControlPillRadiusConstant, PanelControlPrimarySizeConstant } from '../../../../game/constant/panel-control-size.constant';
import { gameGetNumpadRowWidth } from '../../../../game/utils/game-get-numpad-row-width.util';

import { GameInputToolsMinRowWidthConstant, GameInputToolsWideSizeConstant } from './constant/game-input-tools.constant';

export const GameInputToolsStyles = StyleSheet.create((theme, rt) => {
    const isWideLayout = appLayoutScreenIsWide(rt.screen);
    const panelInnerWidth = rt.screen.width - GamePanelHorizontalPaddingConstant * 2;
    const narrowRowWidth = Math.min(panelInnerWidth, Math.max(gameGetNumpadRowWidth(rt.screen.width), GameInputToolsMinRowWidthConstant));
    const toolSize = isWideLayout ? GameInputToolsWideSizeConstant : AppIconButtonSize;
    const primaryToolSize = isWideLayout ? GameInputToolsWideSizeConstant : PanelControlPrimarySizeConstant;

    return {
        inputControls: (isLeftHanded: boolean) => {
            const narrowFlexDirection = isLeftHanded ? 'row-reverse' : 'row';

            return {
                alignItems: 'center',
                alignSelf: 'center',
                flexDirection: isWideLayout ? 'row' : narrowFlexDirection,
                gap: theme.spacing.sm,
                justifyContent: 'space-between',
                width: isWideLayout ? GamePanelWideRowWidthConstant : narrowRowWidth
            };
        },
        utilityGroup: {
            alignItems: 'center',
            flexDirection: 'row',
            gap: theme.spacing.sm
        },
        toolButton: {
            borderRadius: PanelControlPillRadiusConstant,
            height: toolSize,
            width: toolSize
        },
        primaryToolButton: {
            borderRadius: PanelControlPillRadiusConstant,
            height: primaryToolSize,
            width: primaryToolSize
        }
    };
});
