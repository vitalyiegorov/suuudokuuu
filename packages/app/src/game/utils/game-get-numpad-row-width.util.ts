import { SpacingConstant } from '@suuudokuuu/ui/theme';

import { GamePanelHorizontalPaddingConstant } from '../constant/board-cell-size.constant';
import { GameNumpadDigitsConstant } from '../constant/game-numpad-digits.constant';
import { PanelControlSizeConstant } from '../constant/panel-control-size.constant';

export const gameGetNumpadRowWidth = (screenWidth: number): number => {
    const availableWidth = screenWidth - GamePanelHorizontalPaddingConstant * 2;
    const digitStep = PanelControlSizeConstant + SpacingConstant.sm;
    const fittingDigits = Math.floor((availableWidth + SpacingConstant.sm) / digitStep);
    const digitsPerRow = Math.min(GameNumpadDigitsConstant.length, Math.max(1, fittingDigits));

    return digitsPerRow * digitStep - SpacingConstant.sm;
};
