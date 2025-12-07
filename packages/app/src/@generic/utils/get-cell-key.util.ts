import type { CellInterface } from '@suuudokuuu/generator';

export const getCellKey = (cell: Pick<CellInterface, 'x' | 'y'>) => `${cell.y}-${cell.x}`;
