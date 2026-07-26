import { StyleSheet } from 'react-native-unistyles';

import { WideLayoutMediaQuery } from '../../../../@generic/constants/layout-media-query.constant';
import { GameNumpadWideColumnsConstant, GameNumpadWideDigitSizeConstant } from '../../../../game/constant/game-numpad-digits.constant';
import { PanelControlSizeConstant } from '../../../../game/constant/panel-control-size.constant';

const DigitFontSizeRatio = 2.5;

export const GameNumpadStyles = StyleSheet.create(theme => ({
    numpad: {
        alignSelf: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: { xs: theme.spacing.sm, [WideLayoutMediaQuery]: theme.spacing.lg },
        justifyContent: 'center',
        maxWidth: {
            xs: '100%',
            [WideLayoutMediaQuery]:
                GameNumpadWideDigitSizeConstant * GameNumpadWideColumnsConstant + theme.spacing.lg * (GameNumpadWideColumnsConstant - 1)
        }
    },
    digit: {
        height: { xs: PanelControlSizeConstant, [WideLayoutMediaQuery]: GameNumpadWideDigitSizeConstant },
        width: { xs: PanelControlSizeConstant, [WideLayoutMediaQuery]: GameNumpadWideDigitSizeConstant }
    },
    digitText: (fontSizeMultiplier: number) => ({
        fontSize: {
            xs: (PanelControlSizeConstant / DigitFontSizeRatio) * fontSizeMultiplier,
            [WideLayoutMediaQuery]: (GameNumpadWideDigitSizeConstant / DigitFontSizeRatio) * fontSizeMultiplier
        }
    })
}));
