import { StyleSheet } from 'react-native-unistyles';

import { WideLayoutMediaQuery } from '../../../../@generic/constants/layout-media-query.constant';
import { GameNumpadWideColumnsConstant } from '../../../../game/constant/game-numpad-digits.constant';
import { PanelControlSizeConstant } from '../../../../game/constant/panel-control-size.constant';

export const GameNumpadStyles = StyleSheet.create(theme => ({
    numpad: {
        alignSelf: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
        justifyContent: 'center',
        maxWidth: {
            xs: '100%',
            [WideLayoutMediaQuery]:
                PanelControlSizeConstant * GameNumpadWideColumnsConstant + theme.spacing.sm * (GameNumpadWideColumnsConstant - 1)
        }
    }
}));
