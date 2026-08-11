import { describe, expect, it } from '@jest/globals';

import { getLevelRatingText } from './get-level-rating-text.util';

const sampleHellRating = 8.44;
const sampleCeilingRating = 11;

describe('getLevelRatingText', () => {
    it('returns the plain difficulty text when there is no rating yet', () => {
        expect(getLevelRatingText('Easy', 0, false)).toBe('Easy');
    });

    it('returns the plain difficulty text for a negative rating', () => {
        expect(getLevelRatingText('Newbie', -1, false)).toBe('Newbie');
    });

    it('composes the difficulty text with the rating rounded to one decimal place', () => {
        expect(getLevelRatingText('Hell', sampleHellRating, false)).toBe('Hell · 8.4');
    });

    it('appends a ceiling suffix when the rating is capped', () => {
        expect(getLevelRatingText('Infinity', sampleCeilingRating, true)).toBe('Infinity · 11.0+');
    });
});
