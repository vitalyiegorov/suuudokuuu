import { HINT_FLAG_BITS, HINT_TRAILER_VERSION_BITS, HINT_TRAILER_VERSION_V1 } from '../constants/binary-codec.constant';

import type { DecodedGameStateInterface } from '../interfaces/decoded-game-state.interface';
import type { BitInputStream, BitOutputStream } from '@thi.ng/bitstream';

export type HintTrailerInterface = Pick<DecodedGameStateInterface, 'hints'>;

const emptyHintTrailer: HintTrailerInterface = { hints: null };

export const writeHintTrailer = (out: BitOutputStream, hints: boolean[], cellEventCount: number): void => {
    out.write(HINT_TRAILER_VERSION_V1, HINT_TRAILER_VERSION_BITS);

    for (let cellEventIndex = 0; cellEventIndex < cellEventCount; cellEventIndex += 1) {
        out.write(hints[cellEventIndex] ? 1 : 0, HINT_FLAG_BITS);
    }
};

export const readHintTrailer = (input: BitInputStream, cellEventCount: number): HintTrailerInterface => {
    const positionBeforeTrailer = input.position;

    if (cellEventCount === 0 || input.length - positionBeforeTrailer < HINT_TRAILER_VERSION_BITS + cellEventCount * HINT_FLAG_BITS) {
        return emptyHintTrailer;
    }

    if (input.read(HINT_TRAILER_VERSION_BITS) !== HINT_TRAILER_VERSION_V1) {
        input.seek(positionBeforeTrailer);

        return emptyHintTrailer;
    }

    return { hints: Array.from({ length: cellEventCount }, () => input.read(HINT_FLAG_BITS) === 1) };
};
