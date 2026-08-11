import type { CellInterface } from '@suuudokuuu/generator';

export const formatCellLabel = (cell: Pick<CellInterface, 'x' | 'y'>): string => `r${cell.y + 1}c${cell.x + 1}`;
