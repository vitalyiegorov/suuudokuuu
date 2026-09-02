import { appLayoutScreenIsWide } from '@suuudokuuu/ui';
import { StyleSheet } from 'react-native-unistyles';

import { AppIconButtonSize } from '../../../../@generic/components/app-icon-button/constant/app-icon-button-size.constant';
import { PanelControlPillRadiusConstant, PanelControlPrimarySizeConstant } from '../../../../game/constant/panel-control-size.constant';

import { GameInputToolsWideSizeConstant } from './constant/game-input-tools.constant';

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
        height: appLayoutScreenIsWide(rt.screen) ? GameInputToolsWideSizeConstant : AppIconButtonSize,
        width: appLayoutScreenIsWide(rt.screen) ? GameInputToolsWideSizeConstant : AppIconButtonSize
    },
    primaryToolButton: (isLeftHanded: boolean) => {
        const isNarrowLayout = !appLayoutScreenIsWide(rt.screen);
        const thumbEdgeMargin = isLeftHanded ? leftHandedThumbEdgeMargin : rightHandedThumbEdgeMargin;

        return {
            borderRadius: PanelControlPillRadiusConstant,
            height: isNarrowLayout ? PanelControlPrimarySizeConstant : GameInputToolsWideSizeConstant,
            width: isNarrowLayout ? PanelControlPrimarySizeConstant : GameInputToolsWideSizeConstant,
            ...(isNarrowLayout && thumbEdgeMargin)
        };
    }
}));
