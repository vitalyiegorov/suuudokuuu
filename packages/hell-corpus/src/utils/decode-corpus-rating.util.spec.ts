import { describe, expect, it } from '@jest/globals';

import { decodeCorpusRating } from './decode-corpus-rating.util';

const UNRATED_BYTE = 0;
const RATING_TEN_POINT_SIX_BYTE = 106;
const RATING_TEN_POINT_SIX = 10.6;
const RATING_ELEVEN_POINT_NINE_BYTE = 119;
const RATING_ELEVEN_POINT_NINE = 11.9;
const CEILING_FLAG_BYTE = 0xff;
const RATING_TWELVE_POINT_SEVEN = 12.7;

describe('decodeCorpusRating', () => {
    it('decodes an unrated byte as null', () => {
        expect(decodeCorpusRating(UNRATED_BYTE)).toBeNull();
    });

    it('decodes a rating-times-ten byte into its decimal rating', () => {
        expect(decodeCorpusRating(RATING_TEN_POINT_SIX_BYTE)).toBe(RATING_TEN_POINT_SIX);
    });

    it('decodes a rating close to the encodable ceiling', () => {
        expect(decodeCorpusRating(RATING_ELEVEN_POINT_NINE_BYTE)).toBe(RATING_ELEVEN_POINT_NINE);
    });

    it('ignores the ceiling-flag bit when computing the rating value', () => {
        expect(decodeCorpusRating(CEILING_FLAG_BYTE)).toBe(RATING_TWELVE_POINT_SEVEN);
    });
});
