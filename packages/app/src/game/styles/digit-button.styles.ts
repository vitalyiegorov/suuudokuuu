import { appLayoutScreenIsWide } from '@suuudokuuu/ui';
import { StyleSheet } from 'react-native-unistyles';

import { GameNumpadWideDigitSizeConstant } from '../constant/game-numpad-digits.constant';
import { PanelControlPillRadiusConstant, PanelControlSizeConstant } from '../constant/panel-control-size.constant';
import { getDigitButtonFontSize } from '../utils/get-digit-button-font-size.util';

export const DigitButtonStyles = StyleSheet.create((_theme, rt) => {
    const digitSize = appLayoutScreenIsWide(rt.screen) ? GameNumpadWideDigitSizeConstant : PanelControlSizeConstant;

    return {
        button: {
            alignItems: 'center',
            borderRadius: PanelControlPillRadiusConstant,
            height: '100%',
            justifyContent: 'center',
            overflow: 'visible',
            position: 'relative',
            width: '100%'
        },
        container: {
            height: digitSize,
            position: 'relative',
            width: digitSize
        },
        digitText: (fontSizeMultiplier: number, fontScale: number) => ({
            fontSize: getDigitButtonFontSize(digitSize, fontSizeMultiplier, fontScale)
        }),
        exhausted: {
            opacity: 0.35
        }
    };
});
