import { defaultSudokuConfig } from '@suuudokuuu/generator';

import { getCellKey } from '../../@generic/utils/get-cell-key.util';

export const getKeyedCandidates = (indexedCandidates: Record<number, number[]>): Record<string, number[]> => {
    const candidates: Record<string, number[]> = {};

    for (const [cellIndex, values] of Object.entries(indexedCandidates)) {
        const index = parseInt(cellIndex, 10);
        const x = index % defaultSudokuConfig.fieldSize;
        const y = Math.floor(index / defaultSudokuConfig.fieldSize);

        candidates[getCellKey({ x, y })] = values;
    }

    return candidates;
};
