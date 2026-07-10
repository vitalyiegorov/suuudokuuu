import { describe, expect, it } from '@jest/globals';

import { BoardCellSizeCapConstant, GameSidePanelGutterConstant, GameSidePanelWidthConstant } from '../constant/board-cell-size.constant';

import { gameGetBoardCellSize } from './game-get-board-cell-size.util';

describe('gameGetBoardCellSize', () => {
    it('sizes from the limiting dimension in compact layout', () => {
        const cellSize = gameGetBoardCellSize({
            availableWidth: 360,
            availableHeight: 800,
            sizeClass: 'compact',
            panelWidth: GameSidePanelWidthConstant,
            gutter: GameSidePanelGutterConstant
        });

        expect(cellSize).toBe(Math.floor(360 / 9));
    });

    it('subtracts the panel width and gutter from available width in wide layout', () => {
        const cellSize = gameGetBoardCellSize({
            availableWidth: 1200,
            availableHeight: 800,
            sizeClass: 'wide',
            panelWidth: GameSidePanelWidthConstant,
            gutter: GameSidePanelGutterConstant
        });

        expect(cellSize).toBe(Math.floor(Math.min(800, 1200 - GameSidePanelWidthConstant - GameSidePanelGutterConstant) / 9));
    });

    it('caps the cell size on very large containers', () => {
        const cellSize = gameGetBoardCellSize({
            availableWidth: 960,
            availableHeight: 960,
            sizeClass: 'compact',
            panelWidth: GameSidePanelWidthConstant,
            gutter: GameSidePanelGutterConstant
        });

        expect(cellSize).toBe(BoardCellSizeCapConstant);
    });

    it('never returns a negative size for a panel wider than the container', () => {
        const cellSize = gameGetBoardCellSize({
            availableWidth: 300,
            availableHeight: 800,
            sizeClass: 'wide',
            panelWidth: GameSidePanelWidthConstant,
            gutter: GameSidePanelGutterConstant
        });

        expect(cellSize).toBeGreaterThanOrEqual(0);
    });

    it('pins the compact phone cell size for a 390x844 window using the GameScreen interim wiring', () => {
        const expectedCompactPhoneCellSize = 43;
        const cellSize = gameGetBoardCellSize({
            availableWidth: 390,
            availableHeight: 844,
            sizeClass: 'compact',
            panelWidth: GameSidePanelWidthConstant,
            gutter: GameSidePanelGutterConstant
        });

        expect(cellSize).toBe(expectedCompactPhoneCellSize);
    });
});
