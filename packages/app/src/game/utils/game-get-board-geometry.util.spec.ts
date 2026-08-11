import { describe, expect, it } from '@jest/globals';
import { defaultSudokuConfig } from '@suuudokuuu/generator';

import { BoardCellSizeCapConstant, BoardCellSizeMinConstant } from '../constant/board-cell-size.constant';

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
const MinimumCellsSize = fieldSize * BoardCellSizeMinConstant;
const SmallestSupportedPhoneAreaSize = 280;
const FloorBoundaryAreaSizes = [
    MinimumCellsSize - 1,
    MinimumCellsSize,
    MinimumCellsSize + 1,
    MinimumCellsSize + GroupGapCount * DefaultCellMargin,
    MinimumCellsSize + GroupGapCount * DefaultCellMargin + 1
];
const DegradedAreaSizes = [SmallestSupportedPhoneAreaSize, CompactPhoneAreaSize, MinimumCellsSize - 1];

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
                const geometry = getSquareGeometry(areaSize, cellMargin);

                expect(geometry.boardSize).toBe(fieldSize * geometry.cellSize + GroupGapCount * geometry.cellMargin);
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
        expect(getSquareGeometry(0, DefaultCellMargin)).toStrictEqual({ boardSize: 0, cellMargin: 0, cellSize: 0 });
    });

    it('keeps every cell at or above the minimum touch target across screen sizes and spacing settings', () => {
        CellMarginOptions.forEach(cellMargin => {
            [...MeasuredAreaSizes, ...FloorBoundaryAreaSizes].forEach(areaSize => {
                if (areaSize < MinimumCellsSize) {
                    return;
                }

                expect(getSquareGeometry(areaSize, cellMargin).cellSize).toBeGreaterThanOrEqual(BoardCellSizeMinConstant);
            });
        });
    });

    it('spends the group gaps before the cells when the area cannot fit both at the requested spacing', () => {
        const tightestFloorAreaSize = MinimumCellsSize + GroupGapCount * DefaultCellMargin - 1;
        const tightestFloorGeometry = getSquareGeometry(tightestFloorAreaSize, DefaultCellMargin);

        expect(tightestFloorGeometry.cellSize).toBe(BoardCellSizeMinConstant);
        expect(tightestFloorGeometry.cellMargin).toBeLessThan(DefaultCellMargin);
        expect(tightestFloorGeometry.boardSize).toBeLessThanOrEqual(tightestFloorAreaSize);
    });

    it('keeps the requested spacing as soon as the area fits the minimum cells and the group gaps', () => {
        const roomyFloorAreaSize = MinimumCellsSize + GroupGapCount * DefaultCellMargin;
        const roomyFloorGeometry = getSquareGeometry(roomyFloorAreaSize, DefaultCellMargin);

        expect(roomyFloorGeometry.cellMargin).toBe(DefaultCellMargin);
        expect(roomyFloorGeometry.cellSize).toBe(BoardCellSizeMinConstant);
        expect(roomyFloorGeometry.boardSize).toBe(roomyFloorAreaSize);
    });

    it('drops the group gaps to zero and shrinks the cells only when the minimum board cannot fit at all', () => {
        CellMarginOptions.forEach(cellMargin => {
            DegradedAreaSizes.forEach(areaSize => {
                const degradedGeometry = getSquareGeometry(areaSize, cellMargin);

                expect(degradedGeometry.cellMargin).toBe(0);
                expect(degradedGeometry.cellSize).toBe(Math.floor(areaSize / fieldSize));
                expect(degradedGeometry.boardSize).toBeLessThanOrEqual(areaSize);
            });
        });
    });

    it('never reports a spacing wider than the setting the player chose', () => {
        CellMarginOptions.forEach(cellMargin => {
            [...MeasuredAreaSizes, ...FloorBoundaryAreaSizes, ...DegradedAreaSizes].forEach(areaSize => {
                expect(getSquareGeometry(areaSize, cellMargin).cellMargin).toBeLessThanOrEqual(cellMargin);
            });
        });
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

        expect(collapsedGeometry).toStrictEqual({ boardSize: 0, cellMargin: 0, cellSize: 0 });
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

        expect(overReservedGeometry).toStrictEqual({ boardSize: 0, cellMargin: 0, cellSize: 0 });
    });

    it('spends no spacing on a board whose every cell already sits in one group', () => {
        const singleGroupGeometry = gameGetBoardGeometry({
            availableWidth: LargePhoneAreaSize,
            availableHeight: LargePhoneAreaSize,
            reservedHeight: 0,
            fieldSize: fieldGroupSize,
            fieldGroupSize,
            cellMargin: DefaultCellMargin
        });

        expect(singleGroupGeometry.cellMargin).toBe(0);
        expect(singleGroupGeometry.boardSize).toBe(fieldGroupSize * singleGroupGeometry.cellSize);
    });
});
