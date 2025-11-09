import type { CellInterface } from '@suuudokuuu/generator';

export const getCellKey = (cell: CellInterface) => `${cell.y}-${cell.x}`;
