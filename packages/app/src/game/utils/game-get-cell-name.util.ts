import type { CellInterface } from '@suuudokuuu/generator';

export const gameGetCellName = ({ x, y }: Pick<CellInterface, 'x' | 'y'>): string => `r${y + 1}c${x + 1}`;
