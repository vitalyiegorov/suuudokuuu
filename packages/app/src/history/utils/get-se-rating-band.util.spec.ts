import { describe, expect, it } from '@jest/globals';
import { SE_RATING_CEILING } from '@suuudokuuu/rating';

import { getSeRatingBand } from './get-se-rating-band.util';

const FoundationalRating = 1.5;

describe('getSeRatingBand', () => {
    it('should return null for an unrated puzzle', () => {
        expect.assertions(1);

        expect(getSeRatingBand(0)).toBeNull();
    });

    it('should find the foundational band for an easy rating', () => {
        expect.assertions(1);

        expect(getSeRatingBand(FoundationalRating)?.id).toBe('foundational');
    });

    it('should find the ceiling band at and above the SE rating ceiling', () => {
        expect.assertions(2);

        expect(getSeRatingBand(SE_RATING_CEILING)?.id).toBe('ceiling');
        expect(getSeRatingBand(SE_RATING_CEILING + 5)?.id).toBe('ceiling');
    });

    it('should find the correct band at an exact boundary rating', () => {
        expect.assertions(2);

        expect(getSeRatingBand(2.9)?.id).toBe('foundational');
        expect(getSeRatingBand(3.0)?.id).toBe('intermediate');
    });
});
