import { StyleSheet } from 'react-native-unistyles';

import { WideLayoutMediaQuery } from '../../../../@generic/constants/layout-media-query.constant';
import { PanelControlSizeConstant } from '../../../../game/constant/panel-control-size.constant';

export const GameActionsStyles = StyleSheet.create(theme => ({
    actions: {
        alignItems: 'center',
        flexDirection: 'row',
        flexShrink: 0,
        gap: theme.spacing.sm,
        justifyContent: { xs: 'center', [WideLayoutMediaQuery]: 'space-between' }
    },
    button: {
        borderRadius: PanelControlSizeConstant / 2,
        height: PanelControlSizeConstant,
        width: PanelControlSizeConstant
    }
}));
