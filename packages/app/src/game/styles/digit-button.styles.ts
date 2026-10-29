import { appLayoutScreenIsWide } from '@suuudokuuu/ui';
import { StyleSheet } from 'react-native-unistyles';

import { DigitButtonFontSizeCapDivider, DigitButtonFontSizeDivider } from '../constant/font-size.constant';
import { GameNumpadWideDigitSizeConstant } from '../constant/game-numpad-digits.constant';
import { PanelControlPillRadiusConstant, PanelControlSizeConstant } from '../constant/panel-control-size.constant';
import { getFittedFontSize } from '../utils/get-fitted-font-size.util';

export const DigitButtonStyles = StyleSheet.create((_theme, rt) => ({
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
        height: appLayoutScreenIsWide(rt.screen) ? GameNumpadWideDigitSizeConstant : PanelControlSizeConstant,
        position: 'relative',
        width: appLayoutScreenIsWide(rt.screen) ? GameNumpadWideDigitSizeConstant : PanelControlSizeConstant
    },
    digitText: (fontSizeMultiplier: number, fontScale: number) => {
        const digitSize = appLayoutScreenIsWide(rt.screen) ? GameNumpadWideDigitSizeConstant : PanelControlSizeConstant;

        return {
            fontSize: getFittedFontSize(
                digitSize / DigitButtonFontSizeDivider,
                digitSize / DigitButtonFontSizeCapDivider,
                fontSizeMultiplier,
                fontScale
            )
        };
    },
    exhausted: {
        opacity: 0.35
    }
}));
