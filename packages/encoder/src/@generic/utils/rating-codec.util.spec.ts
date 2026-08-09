/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it } from '@jest/globals';
import { BitInputStream, BitOutputStream } from '@thi.ng/bitstream';

import {
    DIFFICULTY_CODE_MAX,
    RATING_TRAILER_VERSION_BITS,
    RATING_TRAILER_VERSION_V1,
    RATING_VALUE_BITS,
    RATING_VALUE_MAX
} from '../constants/binary-codec.constant';

import { emptyRatingTrailer, readRatingTrailer, writeRatingTrailer } from './rating-codec.util';

const UNKNOWN_TRAILER_VERSION = RATING_TRAILER_VERSION_V1 + 1;

const toInputStream = (out: BitOutputStream): BitInputStream => new BitInputStream(out.bytes());

describe('rating trailer codec', () => {
    it('should round-trip a known rating and difficulty', () => {
        expect.assertions(1);

        const out = new BitOutputStream();

        writeRatingTrailer(out, 32, false, 3);

        expect(readRatingTrailer(toInputStream(out))).toStrictEqual({ rating: 32, isRatingCeiling: false, difficulty: 3 });
    });

    it('should round-trip the unknown rating and difficulty sentinel', () => {
        expect.assertions(1);

        const out = new BitOutputStream();

        writeRatingTrailer(out, 0, false, 0);

        expect(readRatingTrailer(toInputStream(out))).toStrictEqual(emptyRatingTrailer);
    });

    it('should round-trip the ceiling flag', () => {
        expect.assertions(1);

        const out = new BitOutputStream();

        writeRatingTrailer(out, 76, true, 6);

        expect(readRatingTrailer(toInputStream(out))).toStrictEqual({ rating: 76, isRatingCeiling: true, difficulty: 6 });
    });

    it('should clamp a rating above the encodable ceiling', () => {
        expect.assertions(1);

        const out = new BitOutputStream();

        writeRatingTrailer(out, RATING_VALUE_MAX + 1, false, 0);

        expect(readRatingTrailer(toInputStream(out)).rating).toBe(RATING_VALUE_MAX);
    });

    it('should clamp a difficulty above the encodable ceiling', () => {
        expect.assertions(1);

        const out = new BitOutputStream();

        writeRatingTrailer(out, 0, false, DIFFICULTY_CODE_MAX + 1);

        expect(readRatingTrailer(toInputStream(out)).difficulty).toBe(DIFFICULTY_CODE_MAX);
    });

    it('should report unknown values when fewer bits remain than a trailer needs', () => {
        expect.assertions(1);

        const out = new BitOutputStream();

        out.write(RATING_TRAILER_VERSION_V1, RATING_TRAILER_VERSION_BITS);

        expect(readRatingTrailer(toInputStream(out))).toStrictEqual(emptyRatingTrailer);
    });

    it('should ignore a trailer version it does not recognise instead of misparsing it', () => {
        expect.assertions(1);

        const out = new BitOutputStream();

        out.write(UNKNOWN_TRAILER_VERSION, RATING_TRAILER_VERSION_BITS);
        out.write(45, RATING_VALUE_BITS);
        out.write(1, 1);
        out.write(4, 3);

        expect(readRatingTrailer(toInputStream(out))).toStrictEqual(emptyRatingTrailer);
    });
});
