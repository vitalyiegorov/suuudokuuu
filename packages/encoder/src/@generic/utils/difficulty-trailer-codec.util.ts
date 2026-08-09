import {
    DIFFICULTY_CODE_BITS,
    DIFFICULTY_TRAILER_MIN_BITS,
    DIFFICULTY_TRAILER_VERSION_BITS,
    DIFFICULTY_TRAILER_VERSION_V1
} from '../constants/binary-codec.constant';

import { isValidDifficultyCode } from './is-valid-difficulty-code.util';

import type { DecodedGameStateInterface } from '../interfaces/decoded-game-state.interface';
import type { BitInputStream, BitOutputStream } from '@thi.ng/bitstream';

export type DifficultyTrailerInterface = Pick<DecodedGameStateInterface, 'difficulty'>;

const emptyDifficultyTrailer: DifficultyTrailerInterface = { difficulty: null };

export const writeDifficultyTrailer = (out: BitOutputStream, difficulty: number): void => {
    out.write(DIFFICULTY_TRAILER_VERSION_V1, DIFFICULTY_TRAILER_VERSION_BITS);
    out.write(difficulty, DIFFICULTY_CODE_BITS);
};

export const readDifficultyTrailer = (input: BitInputStream): DifficultyTrailerInterface => {
    if (input.length - input.position < DIFFICULTY_TRAILER_MIN_BITS) {
        return emptyDifficultyTrailer;
    }

    if (input.read(DIFFICULTY_TRAILER_VERSION_BITS) !== DIFFICULTY_TRAILER_VERSION_V1) {
        return emptyDifficultyTrailer;
    }

    const difficulty = input.read(DIFFICULTY_CODE_BITS);

    return isValidDifficultyCode(difficulty) ? { difficulty } : emptyDifficultyTrailer;
};
