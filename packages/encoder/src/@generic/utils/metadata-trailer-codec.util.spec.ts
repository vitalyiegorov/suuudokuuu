/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it } from '@jest/globals';
import { BitInputStream, BitOutputStream } from '@thi.ng/bitstream';

import {
    DIFFICULTY_CODE_BITS,
    DIFFICULTY_CODE_MAX,
    METADATA_TRAILER_VERSION_BITS,
    METADATA_TRAILER_VERSION_V1,
    METADATA_TRAILER_VERSION_V2,
    RATING_VALUE_BITS,
    RATING_VALUE_MAX
} from '../constants/binary-codec.constant';

import { emptyMetadataTrailer, readMetadataTrailer, writeMetadataTrailer } from './metadata-trailer-codec.util';

const UNKNOWN_TRAILER_VERSION = METADATA_TRAILER_VERSION_V2 + 1;
const OUT_OF_RANGE_DIFFICULTY_CODE = DIFFICULTY_CODE_MAX + 1;

const toInputStream = (out: BitOutputStream): BitInputStream => new BitInputStream(out.bytes());

const writeLegacyDifficultyTrailer = (out: BitOutputStream, difficultyCode: number): void => {
    out.write(METADATA_TRAILER_VERSION_V1, METADATA_TRAILER_VERSION_BITS);
    out.write(difficultyCode, DIFFICULTY_CODE_BITS);
};

describe('metadata trailer codec', () => {
    it('should round-trip a known rating and difficulty', () => {
        expect.assertions(1);

        const out = new BitOutputStream();

        writeMetadataTrailer(out, 32, false, 3);

        expect(readMetadataTrailer(toInputStream(out))).toStrictEqual({ rating: 32, isRatingCeiling: false, difficulty: 3 });
    });

    it('should round-trip the unknown rating and difficulty sentinel', () => {
        expect.assertions(1);

        const out = new BitOutputStream();

        writeMetadataTrailer(out, 0, false, null);

        expect(readMetadataTrailer(toInputStream(out))).toStrictEqual(emptyMetadataTrailer);
    });

    it('should round-trip the ceiling flag', () => {
        expect.assertions(1);

        const out = new BitOutputStream();

        writeMetadataTrailer(out, 76, true, DIFFICULTY_CODE_MAX);

        expect(readMetadataTrailer(toInputStream(out))).toStrictEqual({
            rating: 76,
            isRatingCeiling: true,
            difficulty: DIFFICULTY_CODE_MAX
        });
    });

    it.each([0, 1, 2, 3, 4, 5, DIFFICULTY_CODE_MAX])('should round-trip the difficulty code %s', difficulty => {
        expect.assertions(1);

        const out = new BitOutputStream();

        writeMetadataTrailer(out, 0, false, difficulty);

        expect(readMetadataTrailer(toInputStream(out)).difficulty).toBe(difficulty);
    });

    it('should clamp a rating above the encodable ceiling', () => {
        expect.assertions(1);

        const out = new BitOutputStream();

        writeMetadataTrailer(out, RATING_VALUE_MAX + 1, false, null);

        expect(readMetadataTrailer(toInputStream(out)).rating).toBe(RATING_VALUE_MAX);
    });

    it('should report an absent difficulty for a code above the encodable range', () => {
        expect.assertions(1);

        const out = new BitOutputStream();

        writeMetadataTrailer(out, 0, false, OUT_OF_RANGE_DIFFICULTY_CODE);

        expect(readMetadataTrailer(toInputStream(out)).difficulty).toBeNull();
    });

    it('should report an absent difficulty for a negative code', () => {
        expect.assertions(1);

        const out = new BitOutputStream();

        writeMetadataTrailer(out, 0, false, -1);

        expect(readMetadataTrailer(toInputStream(out)).difficulty).toBeNull();
    });

    it('should report unknown values when fewer bits remain than a trailer needs', () => {
        expect.assertions(1);

        const out = new BitOutputStream();

        out.write(METADATA_TRAILER_VERSION_V2, METADATA_TRAILER_VERSION_BITS);

        expect(readMetadataTrailer(toInputStream(out))).toStrictEqual(emptyMetadataTrailer);
    });

    it('should ignore a trailer version it does not recognise instead of misparsing it', () => {
        expect.assertions(1);

        const out = new BitOutputStream();

        out.write(UNKNOWN_TRAILER_VERSION, METADATA_TRAILER_VERSION_BITS);
        out.write(45, RATING_VALUE_BITS);
        out.write(1, 1);
        out.write(4, DIFFICULTY_CODE_BITS);

        expect(readMetadataTrailer(toInputStream(out))).toStrictEqual(emptyMetadataTrailer);
    });

    it('should rewind the stream when it does not recognise the trailer version', () => {
        expect.assertions(2);

        const out = new BitOutputStream();

        out.write(UNKNOWN_TRAILER_VERSION, METADATA_TRAILER_VERSION_BITS);

        const input = toInputStream(out);

        expect(readMetadataTrailer(input)).toStrictEqual(emptyMetadataTrailer);
        expect(input.position).toBe(0);
    });

    it('should not mistake trailing zero padding bits for a trailer', () => {
        expect.assertions(1);

        const out = new BitOutputStream();

        out.write(0, 1);

        expect(readMetadataTrailer(toInputStream(out))).toStrictEqual(emptyMetadataTrailer);
    });

    describe('version 1 difficulty-only trailers written by v2.4.x apps', () => {
        it.each([0, 1, 2, 3, 4, 5])('should decode the legacy difficulty code %s with an unknown rating', difficultyCode => {
            expect.assertions(1);

            const out = new BitOutputStream();

            writeLegacyDifficultyTrailer(out, difficultyCode);

            expect(readMetadataTrailer(toInputStream(out))).toStrictEqual({
                rating: 0,
                isRatingCeiling: false,
                difficulty: difficultyCode
            });
        });

        it('should report an absent difficulty for a legacy reserved code above the known range', () => {
            expect.assertions(1);

            const out = new BitOutputStream();

            writeLegacyDifficultyTrailer(out, OUT_OF_RANGE_DIFFICULTY_CODE);

            expect(readMetadataTrailer(toInputStream(out))).toStrictEqual(emptyMetadataTrailer);
        });

        it('should report an absent difficulty when fewer bits remain than a legacy trailer needs', () => {
            expect.assertions(2);

            const out = new BitOutputStream();

            out.write(0, 2);
            out.write(METADATA_TRAILER_VERSION_V1, METADATA_TRAILER_VERSION_BITS);

            const input = toInputStream(out);

            input.read(2);

            expect(readMetadataTrailer(input)).toStrictEqual(emptyMetadataTrailer);
            expect(input.position).toBe(2);
        });
    });
});
