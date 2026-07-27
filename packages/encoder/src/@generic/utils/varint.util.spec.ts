/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it } from '@jest/globals';
import { BitInputStream, BitOutputStream } from '@thi.ng/bitstream';

import { readVarint, writeVarint } from './varint.util';

const roundTrip = (value: number, smallBits: number, largeBits: number): number => {
    const out = new BitOutputStream();

    writeVarint(out, value, smallBits, largeBits);

    return readVarint(new BitInputStream(out.bytes()), smallBits, largeBits);
};

describe('varint', () => {
    it.each([0, 1, 62, 63])('should round-trip %s through the small field', value => {
        expect.assertions(1);

        expect(roundTrip(value, 6, 16)).toBe(value);
    });

    it.each([64, 255, 1000, 65535])('should round-trip %s through the large field', value => {
        expect.assertions(1);

        expect(roundTrip(value, 6, 16)).toBe(value);
    });

    it('should clamp a value above the large field capacity', () => {
        expect.assertions(1);

        expect(roundTrip(70000, 6, 16)).toBe(65535);
    });

    it('should clamp a negative value to zero', () => {
        expect.assertions(1);

        expect(roundTrip(-5, 6, 16)).toBe(0);
    });

    it('should truncate a fractional value', () => {
        expect.assertions(1);

        expect(roundTrip(12.7, 6, 16)).toBe(12);
    });

    it('should support the wider score field widths', () => {
        expect.assertions(2);

        expect(roundTrip(4095, 12, 24)).toBe(4095);
        expect(roundTrip(4096, 12, 24)).toBe(4096);
    });
});
