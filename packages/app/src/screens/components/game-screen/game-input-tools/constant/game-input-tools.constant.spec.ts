import { describe, expect, it } from '@jest/globals';
import { SpacingConstant } from '@suuudokuuu/ui/theme';

import {
    BoardCellSizeMinConstant,
    GamePanelHorizontalPaddingConstant,
    GamePanelWideRowWidthConstant
} from '../../../../../game/constant/board-cell-size.constant';

import {
    GameInputToolsCountConstant,
    GameInputToolsMinRowWidthConstant,
    GameInputToolsWideSizeConstant
} from './game-input-tools.constant';

const SmallestPhoneWidth = 320;
const wideToolsWidth =
    GameInputToolsWideSizeConstant * GameInputToolsCountConstant + SpacingConstant.sm * (GameInputToolsCountConstant - 1);

describe('GameInputToolsWideSizeConstant', () => {
    it('keeps the wide tools row inside the number pad bounds', () => {
        expect(wideToolsWidth).toBeLessThanOrEqual(GamePanelWideRowWidthConstant);
    });

    it('stays above the minimum touch target', () => {
        expect(GameInputToolsWideSizeConstant).toBeGreaterThanOrEqual(BoardCellSizeMinConstant);
    });
});

describe('GameInputToolsMinRowWidthConstant', () => {
    it('fits the narrow tools row on the smallest supported phone', () => {
        expect(GameInputToolsMinRowWidthConstant).toBeLessThanOrEqual(SmallestPhoneWidth - GamePanelHorizontalPaddingConstant * 2);
    });
});
