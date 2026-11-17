import { assert, describe, it } from '@effect/vitest';
import { defaultSudokuConfig } from '@suuudokuuu/generator';
import * as Effect from 'effect/Effect';

import {
    ImportedPuzzleAssessmentKindEnum,
    assessImportedPuzzle,
    getMatchingEntryCellIndexes,
    isImportedPuzzleCompleted,
    repairRecognizedPuzzle,
    splitRecognizedPuzzle
} from '../../../src';

const cellCount = defaultSudokuConfig.fieldSize ** 2;
const uncertainConfidence = 0.9;
const emptyPuzzle = '.'.repeat(cellCount);
const digitCount = defaultSudokuConfig.fieldSize;
const easyPuzzle = '2.846.9.5.75.....2.9.32.4.896.1438.75......6.7....82..32..1.54......41....9532...';
const neededClueIndex = 11;
const readExactly = (puzzleString: string) => ({
    puzzleString,
    confidences: Array.from({ length: cellCount }, () => 1),
    handwritten: Array.from({ length: cellCount }, () => false),
    probabilities: Array.from(puzzleString, digit =>
        digit === '.' ? null : Array.from({ length: digitCount }, (_, index) => (index + 1 === Number(digit) ? 1 : 0))
    )
});
const misreadProbability = { wrongDigit: 0.95, likelierDigit: 0.04, printedDigit: 0.03, otherDigit: 0.0025 };
const misread = (puzzleString: string, cellIndex: number, wrongDigit: number, printedProbability = misreadProbability.printedDigit) => {
    const exact = readExactly(puzzleString);

    return {
        ...exact,
        puzzleString: `${puzzleString.slice(0, cellIndex)}${wrongDigit}${puzzleString.slice(cellIndex + 1)}`,
        confidences: exact.confidences.map((confidence, index) => (index === cellIndex ? misreadProbability.wrongDigit : confidence)),
        probabilities: exact.probabilities.map((probabilities, index) =>
            index === cellIndex
                ? Array.from({ length: digitCount }, (_, digitIndex) => {
                      if (digitIndex + 1 === wrongDigit) {
                          return misreadProbability.wrongDigit;
                      }

                      return digitIndex + 1 === Number(puzzleString[cellIndex]) ? printedProbability : misreadProbability.otherDigit;
                  })
                : probabilities
        )
    };
};
const recognized = {
    puzzleString: `12${'.'.repeat(cellCount - 2)}`,
    confidences: Array.from({ length: cellCount }, (_, index) => (index === 0 ? 0.8 : uncertainConfidence)),
    handwritten: Array.from({ length: cellCount }, (_, index) => index === 1)
};

describe('recognized puzzle import', () => {
    it.effect('detects completion only when matching entries fill every missing clue', () =>
        Effect.sync(() => {
            const solution = '123456789'.repeat(9);
            const clues = `.${solution.slice(1)}`;
            const entries = `1${'.'.repeat(cellCount - 1)}`;
            assert.isTrue(isImportedPuzzleCompleted(clues, entries, solution));
            assert.isFalse(isImportedPuzzleCompleted(clues, emptyPuzzle, solution));
            assert.isFalse(isImportedPuzzleCompleted(clues, `2${entries.slice(1)}`, solution));
            assert.isFalse(isImportedPuzzleCompleted(`..${solution.slice(2)}`, entries, solution));
            assert.isFalse(isImportedPuzzleCompleted(solution, emptyPuzzle, solution));
        })
    );

    it.effect('splits printed clues and handwritten entries and applies a strict confidence threshold', () =>
        Effect.sync(() => {
            assert.deepStrictEqual(splitRecognizedPuzzle(recognized, uncertainConfidence), {
                clueString: `1${'.'.repeat(cellCount - 1)}`,
                entryString: `.2${'.'.repeat(cellCount - 2)}`,
                uncertainCellIndexes: [0]
            });
        })
    );

    it.effect('keeps an empty recognized grid empty', () =>
        Effect.sync(() => {
            assert.deepStrictEqual(splitRecognizedPuzzle({ ...recognized, puzzleString: emptyPuzzle }, uncertainConfidence), {
                clueString: emptyPuzzle,
                entryString: emptyPuzzle,
                uncertainCellIndexes: []
            });
        })
    );

    it.effect('rejects recognition arrays with inconsistent lengths', () =>
        Effect.sync(() => {
            assert.isNull(splitRecognizedPuzzle({ ...recognized, puzzleString: '1' }, uncertainConfidence));
            assert.isNull(splitRecognizedPuzzle({ ...recognized, confidences: [] }, uncertainConfidence));
            assert.isNull(splitRecognizedPuzzle({ ...recognized, handwritten: [] }, uncertainConfidence));
        })
    );

    it.effect('repairs a misread clue that duplicates a digit in its column and marks it for review', () =>
        Effect.sync(() => {
            assert.deepStrictEqual(repairRecognizedPuzzle(misread(easyPuzzle, 0, 3), uncertainConfidence), {
                clueString: easyPuzzle,
                entryString: emptyPuzzle,
                uncertainCellIndexes: [0]
            });
        })
    );

    it.effect('repairs a misread clue that leaves the puzzle without a solution', () =>
        Effect.sync(() => {
            const read = misread(easyPuzzle, 0, 1);

            assert.strictEqual(assessImportedPuzzle(read.puzzleString).kind, ImportedPuzzleAssessmentKindEnum.NO_SOLUTION);
            assert.strictEqual(repairRecognizedPuzzle(read, uncertainConfidence)?.clueString, easyPuzzle);
        })
    );

    it.effect('tries the likelier digit first, moves on when it leaves no solution and keeps earlier doubts in board order', () =>
        Effect.sync(() => {
            const read = misread(easyPuzzle, 0, 3);
            const doubtedCellIndex = 2;
            const digitAlreadyInRow = 9;

            assert.deepStrictEqual(
                repairRecognizedPuzzle(
                    {
                        ...read,
                        confidences: read.confidences.map((confidence, index) => (index === doubtedCellIndex ? 0.8 : confidence)),
                        probabilities: read.probabilities.map((probabilities, index) =>
                            index === 0 && probabilities !== null
                                ? probabilities.map((probability, digitIndex) =>
                                      digitIndex + 1 === digitAlreadyInRow ? misreadProbability.likelierDigit : probability
                                  )
                                : probabilities
                        )
                    },
                    uncertainConfidence
                ),
                { clueString: easyPuzzle, entryString: emptyPuzzle, uncertainCellIndexes: [0, doubtedCellIndex] }
            );
        })
    );

    it.effect('leaves a grid with two misread clues for the player to correct', () =>
        Effect.sync(() => {
            const first = misread(easyPuzzle, 0, 3);
            const read = { ...misread(first.puzzleString, 2, 1), probabilities: first.probabilities };

            assert.strictEqual(repairRecognizedPuzzle(read, uncertainConfidence)?.clueString, read.puzzleString);
        })
    );

    it.effect('leaves a misread clue alone when the classifier gave the printed digit almost no chance', () =>
        Effect.sync(() => {
            const read = misread(easyPuzzle, 0, 3, misreadProbability.otherDigit);

            assert.strictEqual(repairRecognizedPuzzle(read, uncertainConfidence)?.clueString, read.puzzleString);
        })
    );

    it.effect('keeps entries as progress while the printed clues alone have one solution', () =>
        Effect.sync(() => {
            const assessment = assessImportedPuzzle(easyPuzzle);
            const solution = assessment.kind === ImportedPuzzleAssessmentKindEnum.UNIQUE ? assessment.solutionString : '';
            const digits = `${solution.slice(0, digitCount)}${easyPuzzle.slice(digitCount)}`;
            const read = {
                ...readExactly(digits),
                handwritten: Array.from(digits, (_, index) => easyPuzzle[index] === '.' && index < digitCount)
            };

            assert.deepStrictEqual(repairRecognizedPuzzle(read, uncertainConfidence), {
                clueString: easyPuzzle,
                entryString: Array.from(digits, (digit, index) => (read.handwritten[index] ? digit : '.')).join(''),
                uncertainCellIndexes: []
            });
        })
    );

    it.effect('moves a clue read as an entry back to the clues, marks it for review and keeps the other entries', () =>
        Effect.sync(() => {
            const assessment = assessImportedPuzzle(easyPuzzle);
            const solution = assessment.kind === ImportedPuzzleAssessmentKindEnum.UNIQUE ? assessment.solutionString : '';
            const digits = `${solution.slice(0, digitCount)}${easyPuzzle.slice(digitCount)}`;
            const isEntry = (index: number): boolean => easyPuzzle[index] === '.' && index < digitCount;
            const read = {
                ...readExactly(digits),
                handwritten: Array.from(digits, (_, index) => index === neededClueIndex || isEntry(index))
            };

            assert.strictEqual(
                assessImportedPuzzle(Array.from(digits, (digit, index) => (read.handwritten[index] ? '.' : digit)).join('')).kind,
                ImportedPuzzleAssessmentKindEnum.MULTIPLE_SOLUTIONS
            );
            assert.deepStrictEqual(repairRecognizedPuzzle(read, uncertainConfidence), {
                clueString: easyPuzzle,
                entryString: Array.from(digits, (digit, index) => (isEntry(index) ? digit : '.')).join(''),
                uncertainCellIndexes: [neededClueIndex]
            });
        })
    );

    it.effect('treats every digit as a clue when the printed clues alone have many solutions', () =>
        Effect.sync(() => {
            const read = {
                ...readExactly(easyPuzzle),
                handwritten: Array.from(easyPuzzle, (digit, index) => digit !== '.' && index < 3 * digitCount)
            };

            assert.deepStrictEqual(repairRecognizedPuzzle(read, uncertainConfidence), {
                clueString: easyPuzzle,
                entryString: emptyPuzzle,
                uncertainCellIndexes: []
            });
        })
    );

    it.effect('rejects recognition without a probability row per cell', () =>
        Effect.sync(() => {
            assert.isNull(repairRecognizedPuzzle({ ...readExactly(easyPuzzle), probabilities: [] }, uncertainConfidence));
        })
    );

    it.effect('matches only entry digits against the solution', () =>
        Effect.sync(() => {
            assert.deepStrictEqual(getMatchingEntryCellIndexes(`12${'.'.repeat(cellCount - 2)}`, `13${'.'.repeat(cellCount - 2)}`), [0]);
            assert.deepStrictEqual(getMatchingEntryCellIndexes(emptyPuzzle, emptyPuzzle), []);
            assert.deepStrictEqual(getMatchingEntryCellIndexes('1', '1'), []);
            assert.deepStrictEqual(getMatchingEntryCellIndexes(emptyPuzzle, '1'), []);
        })
    );
});
