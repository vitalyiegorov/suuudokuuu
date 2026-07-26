import { describe, expect, it } from '@jest/globals';
import { defaultSudokuConfig } from '@suuudokuuu/generator';

import { gameGetBoardCellSize } from './game-get-board-cell-size.util';
import { gameGetBoardSize } from './game-get-board-size.util';

const { fieldSize } = defaultSudokuConfig;
const CompactPhoneAreaSize = 320;
const LargePhoneAreaSize = 480;
const TabletAreaSize = 868;
const DesktopAreaSize = 964;
const LargeDesktopAreaSize = 1024;
const MeasuredAreaSizes = [CompactPhoneAreaSize, LargePhoneAreaSize, TabletAreaSize, DesktopAreaSize, LargeDesktopAreaSize];

describe('gameGetBoardSize', () => {
    it('collapses to zero before the board area has been measured', () => {
        expect(gameGetBoardSize(0, fieldSize)).toBe(0);
    });

    it('never reports a board wider than the area it was measured from', () => {
        MeasuredAreaSizes.forEach(areaSize => {
            const cellSize = gameGetBoardCellSize({ availableWidth: areaSize, availableHeight: areaSize, fieldSize });

            expect(gameGetBoardSize(cellSize, fieldSize)).toBeLessThanOrEqual(areaSize);
        });
    });

    it('stays within one cell of the area it was measured from so the side panel tracks the field', () => {
        MeasuredAreaSizes.forEach(areaSize => {
            const cellSize = gameGetBoardCellSize({ availableWidth: areaSize, availableHeight: areaSize, fieldSize });

            expect(areaSize - gameGetBoardSize(cellSize, fieldSize)).toBeLessThan(fieldSize);
        });
    });
});
