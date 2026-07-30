import { describe, expect, it } from '@jest/globals';
import { defaultSudokuConfig } from '@suuudokuuu/generator';

import { BoardCellSizeCapConstant } from '../constant/board-cell-size.constant';

import { gameGetBoardGeometry } from './game-get-board-geometry.util';

const { fieldSize, fieldGroupHeight: fieldGroupSize } = defaultSudokuConfig;
const CellMarginOptions = [0, 2, 5];
const GroupGapCount = 2;
const CompactPhoneAreaSize = 320;
const LargePhoneAreaSize = 480;
const NineToTwelveTabletAreaSize = 684;
const TenToTwoTabletAreaSize = 740;
const DesktopAreaSize = 964;
const LargeDesktopAreaSize = 1024;
const WideAreaWidth = 900;
const ShortAreaHeight = 420;
const LargeAreaSize = 1600;
const NarrowAreaWidth = 360;
const TallAreaHeight = 800;
const CollapsedAreaWidth = -100;
const DefaultCellMargin = 5;
const MeasuredAreaSizes = [
    CompactPhoneAreaSize,
    LargePhoneAreaSize,
    NineToTwelveTabletAreaSize,
    TenToTwoTabletAreaSize,
    DesktopAreaSize,
    LargeDesktopAreaSize
];

const getSquareGeometry = (areaSize: number, cellMargin: number) =>
    gameGetBoardGeometry({
        availableWidth: areaSize,
        availableHeight: areaSize,
        fieldSize,
        fieldGroupSize,
        cellMargin
    });

describe('gameGetBoardGeometry', () => {
    it('reports the exact size the rendered field occupies, group gaps included', () => {
        CellMarginOptions.forEach(cellMargin => {
            MeasuredAreaSizes.forEach(areaSize => {
                const { cellSize, boardSize } = getSquareGeometry(areaSize, cellMargin);

                expect(boardSize).toBe(fieldSize * cellSize + GroupGapCount * cellMargin);
            });
        });
    });

    it('never reports a board larger than the area it was measured from', () => {
        CellMarginOptions.forEach(cellMargin => {
            MeasuredAreaSizes.forEach(areaSize => {
                expect(getSquareGeometry(areaSize, cellMargin).boardSize).toBeLessThanOrEqual(areaSize);
            });
        });
    });

    it('stays within one cell of the area it was measured from so the side panel tracks the field', () => {
        CellMarginOptions.forEach(cellMargin => {
            MeasuredAreaSizes.forEach(areaSize => {
                expect(areaSize - getSquareGeometry(areaSize, cellMargin).boardSize).toBeLessThan(fieldSize);
            });
        });
    });

    it('sizes the board from the limiting dimension of the measured area', () => {
        const narrowGeometry = gameGetBoardGeometry({
            availableWidth: NarrowAreaWidth,
            availableHeight: TallAreaHeight,
            fieldSize,
            fieldGroupSize,
            cellMargin: DefaultCellMargin
        });

        expect(narrowGeometry).toStrictEqual(getSquareGeometry(NarrowAreaWidth, DefaultCellMargin));
    });

    it('sizes from height when the measured area is wider than it is tall', () => {
        const shortGeometry = gameGetBoardGeometry({
            availableWidth: WideAreaWidth,
            availableHeight: ShortAreaHeight,
            fieldSize,
            fieldGroupSize,
            cellMargin: DefaultCellMargin
        });

        expect(shortGeometry).toStrictEqual(getSquareGeometry(ShortAreaHeight, DefaultCellMargin));
    });

    it('caps the cell size on very large areas', () => {
        expect(getSquareGeometry(LargeAreaSize, DefaultCellMargin).cellSize).toBe(BoardCellSizeCapConstant);
    });

    it('collapses to zero before the board area has been measured', () => {
        expect(getSquareGeometry(0, DefaultCellMargin)).toStrictEqual({ cellSize: 0, boardSize: 0 });
    });

    it('never returns a negative size for a collapsed area', () => {
        const collapsedGeometry = gameGetBoardGeometry({
            availableWidth: CollapsedAreaWidth,
            availableHeight: TallAreaHeight,
            fieldSize,
            fieldGroupSize,
            cellMargin: DefaultCellMargin
        });

        expect(collapsedGeometry).toStrictEqual({ cellSize: 0, boardSize: 0 });
    });
});
