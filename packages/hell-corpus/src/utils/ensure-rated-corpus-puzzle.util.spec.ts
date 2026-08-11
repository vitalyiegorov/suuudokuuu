import { describe, expect, it } from '@jest/globals';

import { ensureRatedCorpusPuzzle } from './ensure-rated-corpus-puzzle.util';

const SAMPLE_INDEX = 0;
const SAMPLE_RATING = 6.6;
const SAMPLE_PUZZLE = '000000000000000001000002034000005600007000080080010700000800000300600000905000003';
const MISSING_RATING_MESSAGE = 'sample corpus record is missing its rating';

describe('ensureRatedCorpusPuzzle', () => {
    it('returns the puzzle, rating, and ceiling flag when the record carries a rating', () => {
        const result = ensureRatedCorpusPuzzle(
            { puzzle: SAMPLE_PUZZLE, rating: SAMPLE_RATING, isCeiling: false },
            SAMPLE_INDEX,
            () => MISSING_RATING_MESSAGE
        );

        expect(result).toEqual({ puzzle: SAMPLE_PUZZLE, rating: SAMPLE_RATING, isCeiling: false });
    });

    it('throws the caller-provided message when the record is missing its rating', () => {
        expect(() =>
            ensureRatedCorpusPuzzle({ puzzle: SAMPLE_PUZZLE, rating: null, isCeiling: false }, SAMPLE_INDEX, () => MISSING_RATING_MESSAGE)
        ).toThrow(MISSING_RATING_MESSAGE);
    });
});
