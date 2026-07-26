import { describe, expect, it } from '@jest/globals';
import { defaultSudokuConfig } from '@suuudokuuu/generator';

import { BoardCellBorderWidthConstant, BoardCellSizeCapConstant } from '../constant/board-cell-size.constant';

import { gameGetBoardCellSize } from './game-get-board-cell-size.util';

const { fieldSize } = defaultSudokuConfig;
const WideAreaWidth = 900;
const ShortAreaHeight = 420;
const LargeAreaSize = 1600;
const NarrowAreaWidth = 360;
const TallAreaHeight = 800;
const CollapsedAreaWidth = -100;

const getExpectedCellSize = (availableSize: number) => Math.floor((availableSize - fieldSize * BoardCellBorderWidthConstant) / fieldSize);

describe('gameGetBoardCellSize', () => {
    it('sizes the board from the limiting dimension of the measured area', () => {
        const cellSize = gameGetBoardCellSize({ availableWidth: NarrowAreaWidth, availableHeight: TallAreaHeight, fieldSize });

        expect(cellSize).toBe(getExpectedCellSize(NarrowAreaWidth));
    });

    it('sizes from height when the measured area is wider than it is tall', () => {
        const cellSize = gameGetBoardCellSize({ availableWidth: WideAreaWidth, availableHeight: ShortAreaHeight, fieldSize });

        expect(cellSize).toBe(getExpectedCellSize(ShortAreaHeight));
    });

    it('caps the cell size on very large areas', () => {
        const cellSize = gameGetBoardCellSize({ availableWidth: LargeAreaSize, availableHeight: LargeAreaSize, fieldSize });

        expect(cellSize).toBe(BoardCellSizeCapConstant);
    });

    it('returns zero before the area has been measured', () => {
        const cellSize = gameGetBoardCellSize({ availableWidth: 0, availableHeight: 0, fieldSize });

        expect(cellSize).toBe(0);
    });

    it('never returns a negative size for a collapsed area', () => {
        const cellSize = gameGetBoardCellSize({ availableWidth: CollapsedAreaWidth, availableHeight: TallAreaHeight, fieldSize });

        expect(cellSize).toBeGreaterThanOrEqual(0);
    });
});
