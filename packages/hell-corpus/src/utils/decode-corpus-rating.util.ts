import type { DecodedCorpusRatingInterface } from '../interfaces/decoded-corpus-rating.interface';

const RATING_SCALE = 10;
const RATING_VALUE_MASK = 0x7f;
const CEILING_FLAG_BIT = 0x80;

export const decodeCorpusRating = (ratingByte: number): DecodedCorpusRatingInterface => {
    // eslint-disable-next-line no-bitwise -- reads the 7-bit rating-times-ten value packed into the record's final byte
    const scaledRating = ratingByte & RATING_VALUE_MASK;

    if (scaledRating === 0) {
        return { rating: null, isCeiling: false };
    }

    return {
        rating: scaledRating / RATING_SCALE,
        // eslint-disable-next-line no-bitwise -- reads the ceiling-flag bit packed into the record's final byte
        isCeiling: (ratingByte & CEILING_FLAG_BIT) !== 0
    };
};
