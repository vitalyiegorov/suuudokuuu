import { describe, expect, it } from '@jest/globals';

import { decodeCorpusRating } from './decode-corpus-rating.util';

const UNRATED_BYTE = 0;
const RATING_TEN_POINT_SIX_BYTE = 106;
const RATING_TEN_POINT_SIX = 10.6;
const RATING_ELEVEN_POINT_NINE_BYTE = 119;
const RATING_ELEVEN_POINT_NINE = 11.9;
const CEILING_FLAG_BYTE = 0xff;
const RATING_TWELVE_POINT_SEVEN = 12.7;
const CEILING_RATING_EIGHT_POINT_FIVE_BYTE = 0xd5;
const RATING_EIGHT_POINT_FIVE = 8.5;

describe('decodeCorpusRating', () => {
    it('decodes an unrated byte as a null rating with no ceiling flag', () => {
        expect(decodeCorpusRating(UNRATED_BYTE)).toEqual({ rating: null, isCeiling: false });
    });

    it('decodes a rating-times-ten byte into its decimal rating with no ceiling flag', () => {
        expect(decodeCorpusRating(RATING_TEN_POINT_SIX_BYTE)).toEqual({ rating: RATING_TEN_POINT_SIX, isCeiling: false });
    });

    it('decodes a rating close to the encodable ceiling', () => {
        expect(decodeCorpusRating(RATING_ELEVEN_POINT_NINE_BYTE)).toEqual({ rating: RATING_ELEVEN_POINT_NINE, isCeiling: false });
    });

    it('separates the ceiling-flag bit from the rating value when computing the rating value', () => {
        expect(decodeCorpusRating(CEILING_FLAG_BYTE)).toEqual({ rating: RATING_TWELVE_POINT_SEVEN, isCeiling: true });
    });

    it('decodes a rater-reported ceiling rating with the ceiling flag set', () => {
        expect(decodeCorpusRating(CEILING_RATING_EIGHT_POINT_FIVE_BYTE)).toEqual({ rating: RATING_EIGHT_POINT_FIVE, isCeiling: true });
    });
});
