import { appLayoutScreenIsWide } from '@suuudokuuu/ui';
import { StyleSheet } from 'react-native-unistyles';

import { GameNumpadWideColumnsConstant, GameNumpadWideDigitSizeConstant } from '../../../../game/constant/game-numpad-digits.constant';
import { PanelControlSizeConstant } from '../../../../game/constant/panel-control-size.constant';

const DigitFontSizeRatio = 2.5;

export const GameNumpadStyles = StyleSheet.create((theme, rt) => ({
    numpad: {
        alignSelf: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: appLayoutScreenIsWide(rt.screen) ? theme.spacing.lg : theme.spacing.sm,
        justifyContent: 'center',
        maxWidth: appLayoutScreenIsWide(rt.screen)
            ? GameNumpadWideDigitSizeConstant * GameNumpadWideColumnsConstant + theme.spacing.lg * (GameNumpadWideColumnsConstant - 1)
            : '100%'
    },
    digit: {
        height: appLayoutScreenIsWide(rt.screen) ? GameNumpadWideDigitSizeConstant : PanelControlSizeConstant,
        width: appLayoutScreenIsWide(rt.screen) ? GameNumpadWideDigitSizeConstant : PanelControlSizeConstant
    },
    digitText: (fontSizeMultiplier: number) => {
        const digitSize = appLayoutScreenIsWide(rt.screen) ? GameNumpadWideDigitSizeConstant : PanelControlSizeConstant;

        return {
            fontSize: (digitSize / DigitFontSizeRatio) * fontSizeMultiplier
        };
    }
}));
