import type { CellInterface } from '../interfaces/cell.interface';

export const getCellKey = (cell: Pick<CellInterface, 'x' | 'y'>): string => `${cell.y}-${cell.x}`;
