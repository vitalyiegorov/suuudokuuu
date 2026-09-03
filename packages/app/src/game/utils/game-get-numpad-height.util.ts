import { SpacingConstant } from '@suuudokuuu/ui/theme';

import { GameNumpadDigitsConstant } from '../constant/game-numpad-digits.constant';
import { PanelControlSizeConstant } from '../constant/panel-control-size.constant';

import { gameGetNumpadRowWidth } from './game-get-numpad-row-width.util';

export const gameGetNumpadHeight = (screenWidth: number): number => {
    const digitStep = PanelControlSizeConstant + SpacingConstant.sm;
    const digitsPerRow = (gameGetNumpadRowWidth(screenWidth) + SpacingConstant.sm) / digitStep;
    const rowCount = Math.ceil(GameNumpadDigitsConstant.length / digitsPerRow);

    return rowCount * PanelControlSizeConstant + (rowCount - 1) * SpacingConstant.sm;
};
