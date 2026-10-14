import { defaultSudokuConfig } from '@suuudokuuu/generator';

import type { CellInterface } from '@suuudokuuu/generator';

const { fieldGroupHeight, fieldGroupWidth, fieldSize } = defaultSudokuConfig;

export const getBoxNumber = (cell: Pick<CellInterface, 'x' | 'y'>): number =>
    Math.floor(cell.y / fieldGroupHeight) * (fieldSize / fieldGroupWidth) + Math.floor(cell.x / fieldGroupWidth) + 1;
