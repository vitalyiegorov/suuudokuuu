import { StyleSheet } from 'react-native-unistyles';

import { BlackIconButtonSize } from '../../../../@generic/components/black-icon-button/constant/black-icon-button-size.constant';
import { WideLayoutMediaQuery } from '../../../../@generic/constants/layout-media-query.constant';
import { PanelControlPillRadiusConstant, PanelControlWideSizeConstant } from '../../../../game/constant/panel-control-size.constant';

const toolButtonSize = { xs: BlackIconButtonSize, [WideLayoutMediaQuery]: PanelControlWideSizeConstant };

export const GameInputToolsStyles = StyleSheet.create(theme => ({
    inputControls: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        justifyContent: 'center'
    },
    toolButton: {
        borderRadius: PanelControlPillRadiusConstant,
        height: toolButtonSize,
        maxHeight: toolButtonSize,
        maxWidth: toolButtonSize,
        minHeight: toolButtonSize,
        minWidth: toolButtonSize,
        width: toolButtonSize
    }
}));
