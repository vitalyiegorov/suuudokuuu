import { isNotEmptyString, isPositiveNumber } from '@rnw-community/shared';

const HomeScreenBlankCell = '.';

export const homeScreenGetCurrentGameProgress = (sudokuString: string, solvedCellCount: number) => {
    if (!isNotEmptyString(sudokuString) || !isPositiveNumber(solvedCellCount)) {
        return 0;
    }

    const remainingCellCount = sudokuString.split('').filter(cell => cell === HomeScreenBlankCell).length;
    const playerCellCount = solvedCellCount + remainingCellCount;

    return Math.min(100, Math.round((solvedCellCount / playerCellCount) * 100));
};
