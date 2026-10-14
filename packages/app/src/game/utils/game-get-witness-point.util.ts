import type { CellInterface } from '@suuudokuuu/generator';

const witnessSpreadRatio = 0.22;

const getCellCenter = (index: number, cellSize: number, cellMargin: number): number =>
    index * cellSize + Math.floor(index / 3) * cellMargin + cellSize / 2;

export const gameGetWitnessPoint = (cell: CellInterface, value: number, cellSize: number, cellMargin: number) => ({
    x: getCellCenter(cell.x, cellSize, cellMargin) + (((value - 1) % 3) - 1) * cellSize * witnessSpreadRatio,
    y: getCellCenter(cell.y, cellSize, cellMargin) + (Math.floor((value - 1) / 3) - 1) * cellSize * witnessSpreadRatio
});
