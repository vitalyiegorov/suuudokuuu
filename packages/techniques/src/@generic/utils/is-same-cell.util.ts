import type { CellInterface } from '@suuudokuuu/generator';

export const isSameCell = (cell: CellInterface, otherCell: CellInterface): boolean => cell.x === otherCell.x && cell.y === otherCell.y;
