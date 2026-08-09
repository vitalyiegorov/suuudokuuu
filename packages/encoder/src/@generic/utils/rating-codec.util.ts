import {
    DIFFICULTY_CODE_BITS,
    DIFFICULTY_CODE_MAX,
    RATING_CEILING_FLAG_BITS,
    RATING_TRAILER_MIN_BITS,
    RATING_TRAILER_VERSION_BITS,
    RATING_TRAILER_VERSION_V1,
    RATING_VALUE_BITS,
    RATING_VALUE_MAX
} from '../constants/binary-codec.constant';

import type { DecodedGameStateInterface } from '../interfaces/decoded-game-state.interface';
import type { BitInputStream, BitOutputStream } from '@thi.ng/bitstream';

export type RatingTrailerInterface = Pick<DecodedGameStateInterface, 'rating' | 'isRatingCeiling' | 'difficulty'>;

export const emptyRatingTrailer: RatingTrailerInterface = { rating: 0, isRatingCeiling: false, difficulty: 0 };

export const writeRatingTrailer = (out: BitOutputStream, rating: number, isRatingCeiling: boolean, difficulty: number): void => {
    const safeRating = Math.min(Math.max(Math.trunc(rating), 0), RATING_VALUE_MAX);
    const safeDifficulty = Math.min(Math.max(Math.trunc(difficulty), 0), DIFFICULTY_CODE_MAX);

    out.write(RATING_TRAILER_VERSION_V1, RATING_TRAILER_VERSION_BITS);
    out.write(safeRating, RATING_VALUE_BITS);
    out.write(isRatingCeiling ? 1 : 0, RATING_CEILING_FLAG_BITS);
    out.write(safeDifficulty, DIFFICULTY_CODE_BITS);
};

export const readRatingTrailer = (input: BitInputStream): RatingTrailerInterface => {
    if (input.length - input.position < RATING_TRAILER_MIN_BITS) {
        return emptyRatingTrailer;
    }

    if (input.read(RATING_TRAILER_VERSION_BITS) !== RATING_TRAILER_VERSION_V1) {
        return emptyRatingTrailer;
    }

    return {
        rating: input.read(RATING_VALUE_BITS),
        isRatingCeiling: input.read(RATING_CEILING_FLAG_BITS) === 1,
        difficulty: input.read(DIFFICULTY_CODE_BITS)
    };
};
