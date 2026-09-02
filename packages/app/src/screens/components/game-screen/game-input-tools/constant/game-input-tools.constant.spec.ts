import { describe, expect, it } from '@jest/globals';
import { SpacingConstant } from '@suuudokuuu/ui/theme';

import { GamePanelHorizontalPaddingConstant, GameSidePanelWidthConstant } from '../../../../../game/constant/board-cell-size.constant';

import { GameInputToolsCountConstant, GameInputToolsWideSizeConstant } from './game-input-tools.constant';

const wideRowWidth = GameInputToolsWideSizeConstant * GameInputToolsCountConstant + SpacingConstant.sm * (GameInputToolsCountConstant - 1);
const panelInnerWidth = GameSidePanelWidthConstant - GamePanelHorizontalPaddingConstant * 2;

describe('GameInputToolsWideSizeConstant', () => {
    it('keeps every wide tool inside the side panel gutters', () => {
        expect(wideRowWidth).toBeLessThanOrEqual(panelInnerWidth);
    });

    it('uses the largest whole size the side panel can carry', () => {
        const oversizedRowWidth =
            (GameInputToolsWideSizeConstant + 1) * GameInputToolsCountConstant + SpacingConstant.sm * (GameInputToolsCountConstant - 1);

        expect(oversizedRowWidth).toBeGreaterThan(panelInnerWidth);
    });
});
