import {
    DIFFICULTY_CODE_BITS,
    DIFFICULTY_CODE_UNKNOWN,
    METADATA_TRAILER_V1_BITS,
    METADATA_TRAILER_V2_BITS,
    METADATA_TRAILER_VERSION_BITS,
    METADATA_TRAILER_VERSION_V1,
    METADATA_TRAILER_VERSION_V2,
    RATING_CEILING_FLAG_BITS,
    RATING_VALUE_BITS,
    RATING_VALUE_MAX
} from '../constants/binary-codec.constant';

import { isValidDifficultyCode } from './is-valid-difficulty-code.util';

import type { DecodedGameStateInterface } from '../interfaces/decoded-game-state.interface';
import type { BitInputStream, BitOutputStream } from '@thi.ng/bitstream';

export type MetadataTrailerInterface = Pick<DecodedGameStateInterface, 'rating' | 'isRatingCeiling' | 'difficulty'>;

export const emptyMetadataTrailer: MetadataTrailerInterface = { rating: 0, isRatingCeiling: false, difficulty: null };

const readDifficultyCode = (input: BitInputStream): number | null => {
    const code = input.read(DIFFICULTY_CODE_BITS);

    return isValidDifficultyCode(code) ? code : null;
};

export const writeMetadataTrailer = (out: BitOutputStream, rating: number, isRatingCeiling: boolean, difficulty: number | null): void => {
    const safeRating = Math.min(Math.max(Math.trunc(rating), 0), RATING_VALUE_MAX);
    const safeDifficulty = isValidDifficultyCode(difficulty) ? difficulty : DIFFICULTY_CODE_UNKNOWN;

    out.write(METADATA_TRAILER_VERSION_V2, METADATA_TRAILER_VERSION_BITS);
    out.write(safeRating, RATING_VALUE_BITS);
    out.write(isRatingCeiling ? 1 : 0, RATING_CEILING_FLAG_BITS);
    out.write(safeDifficulty, DIFFICULTY_CODE_BITS);
};

export const readMetadataTrailer = (input: BitInputStream): MetadataTrailerInterface => {
    const positionBeforeTrailer = input.position;
    const availableBits = input.length - positionBeforeTrailer;

    if (availableBits < METADATA_TRAILER_VERSION_BITS) {
        return emptyMetadataTrailer;
    }

    const version = input.read(METADATA_TRAILER_VERSION_BITS);
    const isLegacyDifficultyTrailer = version === METADATA_TRAILER_VERSION_V1 && availableBits >= METADATA_TRAILER_V1_BITS;
    const isCombinedTrailer = version === METADATA_TRAILER_VERSION_V2 && availableBits >= METADATA_TRAILER_V2_BITS;

    if (isLegacyDifficultyTrailer) {
        return { ...emptyMetadataTrailer, difficulty: readDifficultyCode(input) };
    }

    if (isCombinedTrailer) {
        return {
            rating: input.read(RATING_VALUE_BITS),
            isRatingCeiling: input.read(RATING_CEILING_FLAG_BITS) === 1,
            difficulty: readDifficultyCode(input)
        };
    }

    input.seek(positionBeforeTrailer);

    return emptyMetadataTrailer;
};
