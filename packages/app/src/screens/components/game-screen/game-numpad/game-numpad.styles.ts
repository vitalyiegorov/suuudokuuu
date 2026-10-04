import { appLayoutScreenIsWide } from '@suuudokuuu/ui';
import { StyleSheet } from 'react-native-unistyles';

import { GamePanelWideRowWidthConstant } from '../../../../game/constant/board-cell-size.constant';
import { GameNumpadWideGapConstant } from '../../../../game/constant/game-numpad-digits.constant';
import { gameGetNumpadRowWidth } from '../../../../game/utils/game-get-numpad-row-width.util';

export const GameNumpadStyles = StyleSheet.create((theme, rt) => {
    const isWideLayout = appLayoutScreenIsWide(rt.screen);

    return {
        numpad: (isNumpadHidden: boolean) => ({
            alignSelf: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: isWideLayout ? GameNumpadWideGapConstant : theme.spacing.sm,
            justifyContent: 'center',
            maxWidth: isWideLayout ? GamePanelWideRowWidthConstant : gameGetNumpadRowWidth(rt.screen.width),
            opacity: isNumpadHidden ? 0 : 1
        })
    };
});
