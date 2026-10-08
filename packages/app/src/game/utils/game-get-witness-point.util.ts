import type { CellInterface } from '@suuudokuuu/generator';

export const gameGetWitnessPoint = (cell: CellInterface, value: number, cellSize: number, cellMargin: number) => ({
    x: cell.x * cellSize + Math.floor(cell.x / 3) * cellMargin + 1 + ((((value - 1) % 3) + 0.5) * (cellSize - 2)) / 3,
    y: cell.y * cellSize + Math.floor(cell.y / 3) * cellMargin + 1 + ((Math.floor((value - 1) / 3) + 0.5) * (cellSize - 2)) / 3
});
