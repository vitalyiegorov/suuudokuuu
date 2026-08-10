import type { CellInterface } from '@suuudokuuu/generator';

export const compareCells = (firstCell: CellInterface, secondCell: CellInterface): number =>
    firstCell.y - secondCell.y || firstCell.x - secondCell.x;
