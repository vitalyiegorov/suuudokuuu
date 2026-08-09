import { describe, expect, it } from '@jest/globals';

import { ensureInfinityPuzzleRating } from './ensure-infinity-puzzle-rating.util';

const SAMPLE_INDEX = 0;
const SAMPLE_RATING = 11.9;
const SAMPLE_PUZZLE = '800000000003600000070090200050007000000045700000100030001000068008500010090000400';

describe('ensureInfinityPuzzleRating', () => {
    it('returns the puzzle and rating when the record carries a curated rating', () => {
        const result = ensureInfinityPuzzleRating({ puzzle: SAMPLE_PUZZLE, rating: SAMPLE_RATING }, SAMPLE_INDEX);

        expect(result).toEqual({ puzzle: SAMPLE_PUZZLE, rating: SAMPLE_RATING });
    });

    it('throws when the record is missing its curated rating', () => {
        expect(() => ensureInfinityPuzzleRating({ puzzle: SAMPLE_PUZZLE, rating: null }, SAMPLE_INDEX)).toThrow();
    });
});
