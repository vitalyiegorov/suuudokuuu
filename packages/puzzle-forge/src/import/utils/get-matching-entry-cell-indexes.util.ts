import { defaultSudokuConfig } from '@suuudokuuu/generator';

const cellCount = defaultSudokuConfig.fieldSize ** 2;

export const getMatchingEntryCellIndexes = (entryString: string, solutionString: string): number[] => {
    if (entryString.length !== cellCount || solutionString.length !== cellCount) {
        return [];
    }

    return Array.from(entryString).flatMap((digit, index) => (/[1-9]/u.test(digit) && digit === solutionString[index] ? [index] : []));
};
