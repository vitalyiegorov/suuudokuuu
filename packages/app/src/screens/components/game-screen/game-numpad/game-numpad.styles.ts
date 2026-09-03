import { appLayoutScreenIsWide } from '@suuudokuuu/ui';
import { StyleSheet } from 'react-native-unistyles';

import { GamePanelWideRowWidthConstant } from '../../../../game/constant/board-cell-size.constant';
import { GameNumpadWideDigitSizeConstant, GameNumpadWideGapConstant } from '../../../../game/constant/game-numpad-digits.constant';
import { PanelControlSizeConstant } from '../../../../game/constant/panel-control-size.constant';
import { gameGetNumpadRowWidth } from '../../../../game/utils/game-get-numpad-row-width.util';
import { getDigitButtonFontSize } from '../../../../game/utils/get-digit-button-font-size.util';

export const GameNumpadStyles = StyleSheet.create((theme, rt) => {
    const isWideLayout = appLayoutScreenIsWide(rt.screen);
    const digitSize = isWideLayout ? GameNumpadWideDigitSizeConstant : PanelControlSizeConstant;

    return {
        numpad: (isNumpadHidden: boolean) => ({
            alignSelf: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: isWideLayout ? GameNumpadWideGapConstant : theme.spacing.sm,
            justifyContent: 'center',
            maxWidth: isWideLayout ? GamePanelWideRowWidthConstant : gameGetNumpadRowWidth(rt.screen.width),
            opacity: isNumpadHidden ? 0 : 1
        }),
        digit: {
            height: digitSize,
            width: digitSize
        },
        digitText: (fontSizeMultiplier: number, fontScale: number) => ({
            fontSize: getDigitButtonFontSize(digitSize, fontSizeMultiplier, fontScale)
        })
    };
});
