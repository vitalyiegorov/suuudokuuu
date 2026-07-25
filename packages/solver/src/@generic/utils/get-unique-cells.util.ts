import { CandidateContext } from '../classes/candidate-context/candidate-context';

import type { CellInterface } from '@suuudokuuu/generator';

export const getUniqueCells = (cells: CellInterface[]): CellInterface[] => {
    const cellMap: Record<string, CellInterface> = {};

    for (const cell of cells) {
        cellMap[CandidateContext.getCellKey(cell)] = cell;
    }

    return Object.values(cellMap);
};
