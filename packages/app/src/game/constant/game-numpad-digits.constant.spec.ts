import { describe, expect, it } from '@jest/globals';

import { GamePanelWideRowWidthConstant } from './board-cell-size.constant';
import {
    GameNumpadDigitsConstant,
    GameNumpadWideColumnsConstant,
    GameNumpadWideDigitSizeConstant,
    GameNumpadWideGapConstant
} from './game-numpad-digits.constant';
import { PanelControlSizeConstant } from './panel-control-size.constant';

const wideNumpadWidth =
    GameNumpadWideDigitSizeConstant * GameNumpadWideColumnsConstant + GameNumpadWideGapConstant * (GameNumpadWideColumnsConstant - 1);

describe('GameNumpadWideDigitSizeConstant', () => {
    it('fills the wide panel row so the tools row can share its bounds', () => {
        expect(wideNumpadWidth).toBe(GamePanelWideRowWidthConstant);
    });

    it('scales the digits up from the compact panel control size', () => {
        expect(GameNumpadWideDigitSizeConstant).toBeGreaterThan(PanelControlSizeConstant);
    });

    it('lays every digit out in whole rows of the wide column count', () => {
        expect(GameNumpadDigitsConstant.length % GameNumpadWideColumnsConstant).toBe(0);
    });
});
