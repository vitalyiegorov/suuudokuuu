import { appLayoutScreenIsWide } from '@suuudokuuu/ui';
import { StyleSheet } from 'react-native-unistyles';

import { GameNumpadWideColumnsConstant, GameNumpadWideDigitSizeConstant } from '../../../../game/constant/game-numpad-digits.constant';
import { PanelControlSizeConstant } from '../../../../game/constant/panel-control-size.constant';
import { gameGetNumpadRowWidth } from '../../../../game/utils/game-get-numpad-row-width.util';
import { getDigitButtonFontSize } from '../../../../game/utils/get-digit-button-font-size.util';

export const GameNumpadStyles = StyleSheet.create((theme, rt) => ({
    numpad: {
        alignSelf: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: appLayoutScreenIsWide(rt.screen) ? theme.spacing.lg : theme.spacing.sm,
        justifyContent: 'center',
        maxWidth: appLayoutScreenIsWide(rt.screen)
            ? GameNumpadWideDigitSizeConstant * GameNumpadWideColumnsConstant + theme.spacing.lg * (GameNumpadWideColumnsConstant - 1)
            : gameGetNumpadRowWidth(rt.screen.width)
    },
    digit: {
        height: appLayoutScreenIsWide(rt.screen) ? GameNumpadWideDigitSizeConstant : PanelControlSizeConstant,
        width: appLayoutScreenIsWide(rt.screen) ? GameNumpadWideDigitSizeConstant : PanelControlSizeConstant
    },
    digitText: (fontSizeMultiplier: number, fontScale: number) => {
        const digitSize = appLayoutScreenIsWide(rt.screen) ? GameNumpadWideDigitSizeConstant : PanelControlSizeConstant;

        return {
            fontSize: getDigitButtonFontSize(digitSize, fontSizeMultiplier, fontScale)
        };
    }
}));
