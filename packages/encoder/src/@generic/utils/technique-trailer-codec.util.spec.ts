/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it } from '@jest/globals';
import { BitInputStream, BitOutputStream } from '@thi.ng/bitstream';

import {
    TECHNIQUE_CODE_BITS,
    TECHNIQUE_CODE_MAX,
    TECHNIQUE_TRAILER_VERSION_BITS,
    TECHNIQUE_TRAILER_VERSION_V1
} from '../constants/binary-codec.constant';

import { getTechniqueTrailerBits, readTechniqueTrailer, writeTechniqueTrailer } from './technique-trailer-codec.util';

const toInputStream = (out: BitOutputStream): BitInputStream => new BitInputStream(out.bytes());

describe('techniqueTrailerCodec', () => {
    it('should round-trip one code per cell event', () => {
        expect.assertions(1);

        const out = new BitOutputStream();
        writeTechniqueTrailer(out, [0, 3, 31], 3);

        expect(readTechniqueTrailer(toInputStream(out), 3).techniques).toStrictEqual([0, 3, 31]);
    });

    it('should round-trip an unknown code as null', () => {
        expect.assertions(1);

        const out = new BitOutputStream();
        writeTechniqueTrailer(out, [null, 7], 2);

        expect(readTechniqueTrailer(toInputStream(out), 2).techniques).toStrictEqual([null, 7]);
    });

    it('should pad missing entries with the unknown code', () => {
        expect.assertions(1);

        const out = new BitOutputStream();
        writeTechniqueTrailer(out, [5], 3);

        expect(readTechniqueTrailer(toInputStream(out), 3).techniques).toStrictEqual([5, null, null]);
    });

    it('should clamp codes outside the addressable range', () => {
        expect.assertions(1);

        const out = new BitOutputStream();
        writeTechniqueTrailer(out, [-4, TECHNIQUE_CODE_MAX + 1], 2);

        expect(readTechniqueTrailer(toInputStream(out), 2).techniques).toStrictEqual([0, TECHNIQUE_CODE_MAX]);
    });

    it('should report unknown techniques when no cell event exists', () => {
        expect.assertions(1);

        const out = new BitOutputStream();
        writeTechniqueTrailer(out, [1], 1);

        expect(readTechniqueTrailer(toInputStream(out), 0).techniques).toBeNull();
    });

    it('should report unknown techniques when fewer bits remain than the trailer needs', () => {
        expect.assertions(1);

        const out = new BitOutputStream();
        writeTechniqueTrailer(out, [1, 2], 2);

        expect(readTechniqueTrailer(toInputStream(out), 4).techniques).toBeNull();
    });

    it('should rewind and report unknown techniques for an unrecognised trailer version', () => {
        expect.assertions(2);

        const out = new BitOutputStream();
        out.write(TECHNIQUE_TRAILER_VERSION_V1 + 1, TECHNIQUE_TRAILER_VERSION_BITS);
        out.write(9, TECHNIQUE_CODE_BITS);

        const input = toInputStream(out);

        expect(readTechniqueTrailer(input, 1).techniques).toBeNull();
        expect(input.position).toBe(0);
    });

    it('should size the trailer as a version tag plus one code per cell event', () => {
        expect.assertions(1);

        expect(getTechniqueTrailerBits(10)).toBe(TECHNIQUE_TRAILER_VERSION_BITS + 10 * TECHNIQUE_CODE_BITS);
    });
});
