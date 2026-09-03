import { describe, expect, it } from '@jest/globals';

import { GamePanelWideRowWidthConstant } from './board-cell-size.constant';
import { GameNumpadWideDigitSizeConstant, GameNumpadWideGapConstant } from './game-numpad-digits.constant';

describe('GameNumpadWideDigitSizeConstant', () => {
    it('fills the wide panel row so the tools row can share its bounds', () => {
        expect(GameNumpadWideDigitSizeConstant * 3 + GameNumpadWideGapConstant * 2).toBe(GamePanelWideRowWidthConstant);
    });
});
