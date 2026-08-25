import type { CellInterface } from '@suuudokuuu/generator';

export const getCellKey = (cell: Pick<CellInterface, 'x' | 'y'>): string => `${cell.y}-${cell.x}`;
