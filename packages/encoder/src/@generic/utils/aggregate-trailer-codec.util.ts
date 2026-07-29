import {
    AGGREGATE_COUNT_LARGE_BITS,
    AGGREGATE_COUNT_SMALL_BITS,
    AGGREGATE_TRAILER_MIN_BITS,
    AGGREGATE_TRAILER_VERSION_BITS,
    AGGREGATE_TRAILER_VERSION_V1
} from '../constants/binary-codec.constant';

import { readVarint, writeVarint } from './varint.util';

import type { DecodedGameStateInterface } from '../interfaces/decoded-game-state.interface';
import type { BitInputStream, BitOutputStream } from '@thi.ng/bitstream';

export type AggregateTrailerInterface = Pick<DecodedGameStateInterface, 'pencilCount' | 'screenshotCount'>;

export const emptyAggregateTrailer: AggregateTrailerInterface = { pencilCount: null, screenshotCount: null };

export const writeAggregateTrailer = (out: BitOutputStream, pencilCount: number, screenshotCount: number): void => {
    out.write(AGGREGATE_TRAILER_VERSION_V1, AGGREGATE_TRAILER_VERSION_BITS);
    writeVarint(out, pencilCount, AGGREGATE_COUNT_SMALL_BITS, AGGREGATE_COUNT_LARGE_BITS);
    writeVarint(out, screenshotCount, AGGREGATE_COUNT_SMALL_BITS, AGGREGATE_COUNT_LARGE_BITS);
};

export const readAggregateTrailer = (input: BitInputStream): AggregateTrailerInterface => {
    if (input.length - input.position < AGGREGATE_TRAILER_MIN_BITS) {
        return emptyAggregateTrailer;
    }

    if (input.read(AGGREGATE_TRAILER_VERSION_BITS) !== AGGREGATE_TRAILER_VERSION_V1) {
        return emptyAggregateTrailer;
    }

    return {
        pencilCount: readVarint(input, AGGREGATE_COUNT_SMALL_BITS, AGGREGATE_COUNT_LARGE_BITS),
        screenshotCount: readVarint(input, AGGREGATE_COUNT_SMALL_BITS, AGGREGATE_COUNT_LARGE_BITS)
    };
};
