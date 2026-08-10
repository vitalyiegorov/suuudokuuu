import { describe, expect, it } from '@jest/globals';
import { BitInputStream, BitOutputStream } from '@thi.ng/bitstream';

import {
    DIFFICULTY_CODE_BITS,
    DIFFICULTY_CODE_MAX,
    DIFFICULTY_TRAILER_VERSION_BITS,
    DIFFICULTY_TRAILER_VERSION_V1
} from '../constants/binary-codec.constant';

import { readDifficultyTrailer, writeDifficultyTrailer } from './difficulty-trailer-codec.util';

const UNKNOWN_TRAILER_VERSION = DIFFICULTY_TRAILER_VERSION_V1 + 1;
const OUT_OF_RANGE_DIFFICULTY_CODE = DIFFICULTY_CODE_MAX + 1;

const toInputStream = (out: BitOutputStream): BitInputStream => new BitInputStream(out.bytes());

describe('difficulty trailer codec', () => {
    it.each([0, 1, 2, 3, 4, DIFFICULTY_CODE_MAX])('should round-trip the difficulty code %s', difficulty => {
        expect.assertions(1);

        const out = new BitOutputStream();

        writeDifficultyTrailer(out, difficulty);

        expect(readDifficultyTrailer(toInputStream(out))).toStrictEqual({ difficulty });
    });

    it('should report an absent difficulty when fewer bits remain than a trailer needs', () => {
        expect.assertions(1);

        const out = new BitOutputStream();

        out.write(DIFFICULTY_TRAILER_VERSION_V1, DIFFICULTY_TRAILER_VERSION_BITS);

        const input = toInputStream(out);

        input.read(2);

        expect(readDifficultyTrailer(input)).toStrictEqual({ difficulty: null });
    });

    it('should ignore a trailer version it does not recognise instead of misparsing it', () => {
        expect.assertions(1);

        const out = new BitOutputStream();

        out.write(UNKNOWN_TRAILER_VERSION, DIFFICULTY_TRAILER_VERSION_BITS);
        out.write(DIFFICULTY_CODE_MAX, DIFFICULTY_CODE_BITS);

        expect(readDifficultyTrailer(toInputStream(out))).toStrictEqual({ difficulty: null });
    });

    it('should report an absent difficulty for a reserved code above the known range', () => {
        expect.assertions(1);

        const out = new BitOutputStream();

        out.write(DIFFICULTY_TRAILER_VERSION_V1, DIFFICULTY_TRAILER_VERSION_BITS);
        out.write(OUT_OF_RANGE_DIFFICULTY_CODE, DIFFICULTY_CODE_BITS);

        expect(readDifficultyTrailer(toInputStream(out))).toStrictEqual({ difficulty: null });
    });

    it('should not mistake trailing zero padding bits for a trailer', () => {
        expect.assertions(1);

        const out = new BitOutputStream();

        out.write(0, 1);

        expect(readDifficultyTrailer(toInputStream(out))).toStrictEqual({ difficulty: null });
    });
});
