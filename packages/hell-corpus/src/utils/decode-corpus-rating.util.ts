const RATING_SCALE = 10;
const RATING_VALUE_MASK = 0x7f;

export const decodeCorpusRating = (ratingByte: number): number | null => {
    // eslint-disable-next-line no-bitwise -- reads the 7-bit rating-times-ten value packed into the record's final byte
    const scaledRating = ratingByte & RATING_VALUE_MASK;

    if (scaledRating === 0) {
        return null;
    }

    return scaledRating / RATING_SCALE;
};
