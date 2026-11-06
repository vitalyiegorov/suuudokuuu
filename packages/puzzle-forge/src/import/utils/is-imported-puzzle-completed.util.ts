import { defaultSudokuConfig } from '@suuudokuuu/generator';

import { getMatchingEntryCellIndexes } from './get-matching-entry-cell-indexes.util';

export const isImportedPuzzleCompleted = (clueString: string, entryString: string, solutionString: string): boolean => {
    const matchingIndexes = getMatchingEntryCellIndexes(entryString, solutionString);

    return (
        clueString.length === defaultSudokuConfig.fieldSize ** 2 &&
        matchingIndexes.length > 0 &&
        Array.from(clueString).every((digit, index) => digit === solutionString[index] || matchingIndexes.includes(index))
    );
};
