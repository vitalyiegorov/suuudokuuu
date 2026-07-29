/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it } from '@jest/globals';
import { BitInputStream, BitOutputStream } from '@thi.ng/bitstream';

import {
    AGGREGATE_COUNT_LARGE_BITS,
    AGGREGATE_COUNT_SMALL_BITS,
    AGGREGATE_TRAILER_VERSION_BITS,
    AGGREGATE_TRAILER_VERSION_V1
} from '../constants/binary-codec.constant';

import { readAggregateTrailer, writeAggregateTrailer } from './aggregate-trailer-codec.util';
import { writeVarint } from './varint.util';

const UNKNOWN_TRAILER_VERSION = AGGREGATE_TRAILER_VERSION_V1 + 1;

const toInputStream = (out: BitOutputStream): BitInputStream => new BitInputStream(out.bytes());

describe('aggregate trailer codec', () => {
    it('should round-trip both counts', () => {
        expect.assertions(1);

        const out = new BitOutputStream();

        writeAggregateTrailer(out, 21, 4);

        expect(readAggregateTrailer(toInputStream(out))).toStrictEqual({ pencilCount: 21, screenshotCount: 4 });
    });

    it('should report unknown counts when fewer bits remain than a trailer needs', () => {
        expect.assertions(1);

        const out = new BitOutputStream();

        out.write(AGGREGATE_TRAILER_VERSION_V1, AGGREGATE_TRAILER_VERSION_BITS);

        expect(readAggregateTrailer(toInputStream(out))).toStrictEqual({ pencilCount: null, screenshotCount: null });
    });

    it('should ignore a trailer version it does not recognise instead of misparsing it', () => {
        expect.assertions(1);

        const out = new BitOutputStream();

        out.write(UNKNOWN_TRAILER_VERSION, AGGREGATE_TRAILER_VERSION_BITS);
        writeVarint(out, 7, AGGREGATE_COUNT_SMALL_BITS, AGGREGATE_COUNT_LARGE_BITS);
        writeVarint(out, 2, AGGREGATE_COUNT_SMALL_BITS, AGGREGATE_COUNT_LARGE_BITS);

        expect(readAggregateTrailer(toInputStream(out))).toStrictEqual({ pencilCount: null, screenshotCount: null });
    });
});
