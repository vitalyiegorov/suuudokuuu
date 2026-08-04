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
const NoReservedHeight = 0;
const ToolsSlotReservedHeight = 60;
const HeightBoundAreaWidth = 420;
const HeightBoundAreaHeight = 440;
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
        reservedHeight: NoReservedHeight,
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
            reservedHeight: NoReservedHeight,
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
            reservedHeight: NoReservedHeight,
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
            reservedHeight: NoReservedHeight,
            fieldSize,
            fieldGroupSize,
            cellMargin: DefaultCellMargin
        });

        expect(collapsedGeometry).toStrictEqual({ cellSize: 0, boardSize: 0 });
    });

    it('reserves height for a fixed sibling before fitting the board to the limiting height', () => {
        const geometryWithReservedHeight = gameGetBoardGeometry({
            availableWidth: HeightBoundAreaWidth,
            availableHeight: HeightBoundAreaHeight,
            reservedHeight: ToolsSlotReservedHeight,
            fieldSize,
            fieldGroupSize,
            cellMargin: DefaultCellMargin
        });
        const geometryWithoutReservedHeight = gameGetBoardGeometry({
            availableWidth: HeightBoundAreaWidth,
            availableHeight: HeightBoundAreaHeight,
            reservedHeight: NoReservedHeight,
            fieldSize,
            fieldGroupSize,
            cellMargin: DefaultCellMargin
        });

        expect(geometryWithReservedHeight.boardSize).toBeLessThan(geometryWithoutReservedHeight.boardSize);
        expect(geometryWithReservedHeight.boardSize + ToolsSlotReservedHeight).toBeLessThanOrEqual(HeightBoundAreaHeight);
    });

    it('never returns a negative size when the reserved height exceeds the measured height', () => {
        const overReservedGeometry = gameGetBoardGeometry({
            availableWidth: HeightBoundAreaWidth,
            availableHeight: ToolsSlotReservedHeight,
            reservedHeight: HeightBoundAreaHeight,
            fieldSize,
            fieldGroupSize,
            cellMargin: DefaultCellMargin
        });

        expect(overReservedGeometry).toStrictEqual({ cellSize: 0, boardSize: 0 });
    });
});
