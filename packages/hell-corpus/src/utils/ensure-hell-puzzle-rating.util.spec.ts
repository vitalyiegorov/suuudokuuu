import { describe, expect, it } from '@jest/globals';

import { ensureHellPuzzleRating } from './ensure-hell-puzzle-rating.util';

const SAMPLE_INDEX = 0;
const SAMPLE_RATING = 6.6;
const SAMPLE_PUZZLE = '000000000000000001000002034000005600007000080080010700000800000300600000905000003';

describe('ensureHellPuzzleRating', () => {
    it('returns the puzzle, rating, and ceiling flag when the record carries a stored rating', () => {
        const result = ensureHellPuzzleRating({ puzzle: SAMPLE_PUZZLE, rating: SAMPLE_RATING, isCeiling: false }, SAMPLE_INDEX);

        expect(result).toEqual({ puzzle: SAMPLE_PUZZLE, rating: SAMPLE_RATING, isCeiling: false });
    });

    it('passes through a rater-reported ceiling flag', () => {
        const result = ensureHellPuzzleRating({ puzzle: SAMPLE_PUZZLE, rating: SAMPLE_RATING, isCeiling: true }, SAMPLE_INDEX);

        expect(result.isCeiling).toBe(true);
    });

    it('throws when the record is missing its stored rating', () => {
        expect(() => ensureHellPuzzleRating({ puzzle: SAMPLE_PUZZLE, rating: null, isCeiling: false }, SAMPLE_INDEX)).toThrow();
    });
});
