import { describe, expect, it } from '@jest/globals';

import { formatSeRatingValue } from './format-se-rating-value.util';

const unroundedRating = 8.46;
const roundedRating = 8.5;

describe('formatSeRatingValue', () => {
    it('formats a non-ceiling rating to one decimal place', () => {
        expect(formatSeRatingValue(unroundedRating, false)).toBe('8.5');
    });

    it('appends a ceiling suffix when the rating is a ceiling', () => {
        expect(formatSeRatingValue(roundedRating, true)).toBe('8.5+');
    });

    it('returns an empty string for a non-positive rating', () => {
        expect(formatSeRatingValue(0, false)).toBe('');
    });
});
