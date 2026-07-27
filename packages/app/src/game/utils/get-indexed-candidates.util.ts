import { defaultSudokuConfig } from '@suuudokuuu/generator';

export const getIndexedCandidates = (candidates: Record<string, number[]>): Record<number, number[]> => {
    const indexedCandidates: Record<number, number[]> = {};

    for (const [cellKey, values] of Object.entries(candidates)) {
        const [y, x] = cellKey.split('-').map(part => parseInt(part, 10));

        indexedCandidates[y * defaultSudokuConfig.fieldSize + x] = values;
    }

    return indexedCandidates;
};
