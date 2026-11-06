import { assert, describe, it } from '@effect/vitest';
import { defaultSudokuConfig } from '@suuudokuuu/generator';
import * as Effect from 'effect/Effect';

import { getMatchingEntryCellIndexes, splitRecognizedPuzzle } from '../../../src';

const cellCount = defaultSudokuConfig.fieldSize ** 2;
const uncertainConfidence = 0.9;
const emptyPuzzle = '.'.repeat(cellCount);
const recognized = {
    puzzleString: `12${'.'.repeat(cellCount - 2)}`,
    confidences: Array.from({ length: cellCount }, (_, index) => (index === 0 ? 0.8 : uncertainConfidence)),
    handwritten: Array.from({ length: cellCount }, (_, index) => index === 1)
};

describe('recognized puzzle import', () => {
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

    it.effect('matches only entry digits against the solution', () =>
        Effect.sync(() => {
            assert.deepStrictEqual(getMatchingEntryCellIndexes(`12${'.'.repeat(cellCount - 2)}`, `13${'.'.repeat(cellCount - 2)}`), [0]);
            assert.deepStrictEqual(getMatchingEntryCellIndexes(emptyPuzzle, emptyPuzzle), []);
            assert.deepStrictEqual(getMatchingEntryCellIndexes('1', '1'), []);
            assert.deepStrictEqual(getMatchingEntryCellIndexes(emptyPuzzle, '1'), []);
        })
    );
});
