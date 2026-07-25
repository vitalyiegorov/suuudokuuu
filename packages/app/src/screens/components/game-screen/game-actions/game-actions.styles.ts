import { StyleSheet } from 'react-native-unistyles';

import { PanelControlSizeConstant } from '../../../../game/constant/panel-control-size.constant';

export const GameActionsStyles = StyleSheet.create(theme => ({
    actions: {
        flexDirection: 'row',
        flexShrink: 0,
        gap: theme.spacing.sm,
        justifyContent: 'center'
    },
    button: {
        borderRadius: PanelControlSizeConstant / 2,
        height: PanelControlSizeConstant,
        width: PanelControlSizeConstant
    }
}));
