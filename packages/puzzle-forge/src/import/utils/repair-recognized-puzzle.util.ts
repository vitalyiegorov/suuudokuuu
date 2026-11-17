import { BitmaskSolver } from '@suuudokuuu/solver-bitmask';
import { GRID_BLANK_VALUE, UNIQUENESS_COUNT_LIMIT, parseGridString } from '@suuudokuuu/solver-core';

import { isDefined, isNotEmptyArray } from '@rnw-community/shared';

import { getConflictingCellIndexes } from './get-conflicting-cell-indexes.util';
import { splitRecognizedPuzzle } from './split-recognized-puzzle.util';

import type { RecognizedPuzzleInterface } from '../../@generic/interfaces/recognized-puzzle.interface';

const blankCell = '.';
const repairAttemptLimit = 200;
const minimumLikelihood = 0.01;

const parseClues = (clueString: string): Uint8Array => parseGridString(clueString.replaceAll(blankCell, String(GRID_BLANK_VALUE)));

const countSolutions = (clueString: string): number => {
    const grid = parseClues(clueString);

    return isNotEmptyArray(getConflictingCellIndexes(grid)) ? 0 : new BitmaskSolver().countSolutions(grid, UNIQUENESS_COUNT_LIMIT);
};

const replaceCell = (clueString: string, cellIndex: number, digit: string): string =>
    `${clueString.slice(0, cellIndex)}${digit}${clueString.slice(cellIndex + 1)}`;

const findMisreadCell = (
    clueString: string,
    { confidences, probabilities }: Pick<RecognizedPuzzleInterface, 'confidences' | 'probabilities'>
) => {
    const conflictingCellIndexes = getConflictingCellIndexes(parseClues(clueString));
    const suspectCellIndexes = isNotEmptyArray(conflictingCellIndexes)
        ? conflictingCellIndexes
        : Array.from(clueString, (_, cellIndex) => cellIndex).filter(cellIndex => clueString[cellIndex] !== blankCell);

    return suspectCellIndexes
        .flatMap(cellIndex =>
            (probabilities[cellIndex] ?? []).map((probability, digitIndex) => ({
                cellIndex,
                digit: String(digitIndex + 1),
                likelihood: probability / confidences[cellIndex]
            }))
        )
        .filter(({ cellIndex, digit, likelihood }) => digit !== clueString[cellIndex] && likelihood >= minimumLikelihood)
        .sort((first, second) => second.likelihood - first.likelihood)
        .slice(0, repairAttemptLimit)
        .find(({ cellIndex, digit }) => countSolutions(replaceCell(clueString, cellIndex, digit)) === 1);
};

const reviewClue = (split: NonNullable<ReturnType<typeof splitRecognizedPuzzle>>, cellIndex: number, digit: string) => ({
    clueString: replaceCell(split.clueString, cellIndex, digit),
    entryString: replaceCell(split.entryString, cellIndex, blankCell),
    uncertainCellIndexes: [...new Set([...split.uncertainCellIndexes, cellIndex])].sort((first, second) => first - second)
});

export const repairRecognizedPuzzle = (recognized: RecognizedPuzzleInterface, uncertainConfidence: number) => {
    const split = splitRecognizedPuzzle(recognized, uncertainConfidence);

    if (!isDefined(split) || recognized.probabilities.length !== recognized.puzzleString.length) {
        return null;
    }

    const solutionCount = countSolutions(split.clueString);

    if (solutionCount === 1) {
        return split;
    }

    if (solutionCount === 0) {
        const misread = findMisreadCell(split.clueString, recognized);

        return isDefined(misread) ? reviewClue(split, misread.cellIndex, misread.digit) : split;
    }

    const misflaggedCellIndex = Array.from(split.entryString, (_, cellIndex) => cellIndex).find(
        cellIndex =>
            split.entryString[cellIndex] !== blankCell &&
            countSolutions(replaceCell(split.clueString, cellIndex, split.entryString[cellIndex])) === 1
    );

    if (isDefined(misflaggedCellIndex)) {
        return reviewClue(split, misflaggedCellIndex, split.entryString[misflaggedCellIndex]);
    }

    const digitString = Array.from(split.clueString, (digit, cellIndex) =>
        digit === blankCell ? split.entryString[cellIndex] : digit
    ).join('');

    return digitString.includes(blankCell) && countSolutions(digitString) === 1
        ? { ...split, clueString: digitString, entryString: blankCell.repeat(digitString.length) }
        : split;
};
