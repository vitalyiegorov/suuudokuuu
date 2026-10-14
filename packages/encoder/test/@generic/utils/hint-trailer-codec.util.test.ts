import { BitInputStream, BitOutputStream } from '@thi.ng/bitstream';
import { describe, expect, it } from 'vitest';

import { HINT_TRAILER_VERSION_BITS } from '../../../src/@generic/constants/binary-codec.constant';
import { readHintTrailer, writeHintTrailer } from '../../../src/@generic/utils/hint-trailer-codec.util';

const toInputStream = (out: BitOutputStream): BitInputStream => new BitInputStream(out.bytes());

describe('hintTrailerCodec', () => {
    it('should round-trip one flag per cell event', () => {
        expect.assertions(1);

        const out = new BitOutputStream();
        writeHintTrailer(out, [true, false, true], 3);

        expect(readHintTrailer(toInputStream(out), 3).hints).toStrictEqual([true, false, true]);
    });

    it('should report null hints when no cell event exists', () => {
        expect.assertions(1);

        const out = new BitOutputStream();
        writeHintTrailer(out, [], 0);

        expect(readHintTrailer(toInputStream(out), 0).hints).toBeNull();
    });

    it('should report null hints when fewer bits remain than the trailer needs', () => {
        expect.assertions(1);

        const out = new BitOutputStream();
        writeHintTrailer(out, [true], 1);

        expect(readHintTrailer(toInputStream(out), 9).hints).toBeNull();
    });

    it('should rewind and report null hints for an unrecognised trailer version', () => {
        expect.assertions(2);

        const out = new BitOutputStream();
        out.write(2, HINT_TRAILER_VERSION_BITS);
        out.write(1, 1);
        const input = toInputStream(out);

        expect(readHintTrailer(input, 1).hints).toBeNull();
        expect(input.position).toBe(0);
    });
});
