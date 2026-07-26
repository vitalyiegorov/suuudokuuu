import { describe, expect, it } from '@jest/globals';
import { SpacingConstant } from '@suuudokuuu/ui/theme';

import { GameSidePanelWidthConstant } from './board-cell-size.constant';
import { GameNumpadDigitsConstant, GameNumpadWideColumnsConstant, GameNumpadWideDigitSizeConstant } from './game-numpad-digits.constant';
import { PanelControlSizeConstant } from './panel-control-size.constant';

const panelInnerWidth = GameSidePanelWidthConstant - SpacingConstant.sm * 2;
const wideNumpadWidth =
    GameNumpadWideDigitSizeConstant * GameNumpadWideColumnsConstant + SpacingConstant.sm * (GameNumpadWideColumnsConstant - 1);

describe('GameNumpadWideDigitSizeConstant', () => {
    it('keeps the wide numpad inside the side panel gutters', () => {
        expect(wideNumpadWidth).toBeLessThanOrEqual(panelInnerWidth);
    });

    it('scales the digits up from the compact panel control size', () => {
        expect(GameNumpadWideDigitSizeConstant).toBeGreaterThan(PanelControlSizeConstant);
    });

    it('lays every digit out in whole rows of the wide column count', () => {
        expect(GameNumpadDigitsConstant.length % GameNumpadWideColumnsConstant).toBe(0);
    });
});
