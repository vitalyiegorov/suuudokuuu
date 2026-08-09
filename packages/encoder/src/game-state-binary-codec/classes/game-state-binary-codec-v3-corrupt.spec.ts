/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it } from '@jest/globals';
import { BitOutputStream } from '@thi.ng/bitstream';

import {
    CODEC_VERSION_BITS,
    CODEC_VERSION_V3,
    DIFFICULTY_CODE_BITS,
    EVENT_COUNT_BITS,
    HAS_TAG_STREAM_BITS,
    IS_CHALLENGE_RUN_BITS,
    MAX_MISTAKES_BITS,
    PAYLOAD_KIND_BITS,
    RATING_CEILING_FLAG_BITS,
    RATING_TRAILER_VERSION_BITS,
    RATING_TRAILER_VERSION_V1,
    RATING_VALUE_BITS,
    TAG_CELL_FLAG_BITS,
    TAG_SUBCODE_BITS
} from '../../@generic/constants/binary-codec.constant';
import { GRID_CELL_COUNT } from '../../@generic/constants/grid.constant';
import { SharedPayloadKindEnum } from '../../@generic/enums/shared-payload-kind.enum';
import { bytesToBase64url } from '../../@generic/utils/bytes-to-base64url.util';

import { GameStateBinaryCodecV3 } from './game-state-binary-codec-v3';

const unsupportedPayloadKind = 3;
const unsupportedEventSubcode = 15;
const impossibleEventCount = 1023;
const legacyVersion = 2;

const writeHeader = (out: BitOutputStream, kind: number, hasTagStream: boolean): void => {
    out.write(CODEC_VERSION_V3, CODEC_VERSION_BITS);
    out.write(kind, PAYLOAD_KIND_BITS);
    out.write(hasTagStream ? 1 : 0, HAS_TAG_STREAM_BITS);
    out.write(0, IS_CHALLENGE_RUN_BITS);
    out.write(3, MAX_MISTAKES_BITS);
};

const writeEmptyGivensMask = (out: BitOutputStream): void => {
    for (let cellIndex = 0; cellIndex < GRID_CELL_COUNT; cellIndex += 1) {
        out.write(0, 1);
    }
};

const buildPayload = (writeBody: (out: BitOutputStream) => void): string => {
    const out = new BitOutputStream();

    writeBody(out);

    return bytesToBase64url(out.bytes());
};

describe('GameStateBinaryCodecV3 corrupt payloads', () => {
    const codec = new GameStateBinaryCodecV3();

    it('should throw for a version it does not understand', () => {
        expect.assertions(1);

        const payload = buildPayload(out => {
            out.write(legacyVersion, CODEC_VERSION_BITS);
            out.write(SharedPayloadKindEnum.Puzzle, PAYLOAD_KIND_BITS);
        });

        expect(() => codec.decode(payload)).toThrow('Unsupported game state version');
    });

    it('should throw for an unknown payload kind', () => {
        expect.assertions(1);

        const payload = buildPayload(out => void writeHeader(out, unsupportedPayloadKind, false));

        expect(() => codec.decode(payload)).toThrow('Unsupported shared payload kind');
    });

    it('should throw for an unknown event kind subcode', () => {
        expect.assertions(1);

        const payload = buildPayload(out => {
            writeHeader(out, SharedPayloadKindEnum.Challenge, true);
            writeEmptyGivensMask(out);
            out.write(1, EVENT_COUNT_BITS);
            out.write(1, TAG_CELL_FLAG_BITS);
            out.write(unsupportedEventSubcode, TAG_SUBCODE_BITS);
        });

        expect(() => codec.decode(payload)).toThrow('Unsupported timeline event kind');
    });

    it('should throw when more cell events are claimed than the grid can hold', () => {
        expect.assertions(1);

        const payload = buildPayload(out => {
            writeHeader(out, SharedPayloadKindEnum.Challenge, false);
            writeEmptyGivensMask(out);
            out.write(impossibleEventCount, EVENT_COUNT_BITS);
        });

        expect(() => codec.decode(payload)).toThrow('Invalid timeline cell event count');
    });

    it('should throw when a cell event position falls outside the empty cells', () => {
        expect.assertions(1);

        const payload = buildPayload(out => {
            writeHeader(out, SharedPayloadKindEnum.Challenge, false);
            writeEmptyGivensMask(out);
            out.write(1, EVENT_COUNT_BITS);
            out.write(127, 7);
        });

        expect(() => codec.decode(payload)).toThrow('Invalid timeline cell event position');
    });

    it('should throw for a base64url payload with an invalid character', () => {
        expect.assertions(1);

        expect(() => codec.decode('not valid!')).toThrow('Invalid base64url character');
    });

    it('should degrade to the unknown rating sentinel for a truncated rating trailer', () => {
        expect.assertions(3);

        const payload = buildPayload(out => {
            writeHeader(out, SharedPayloadKindEnum.Challenge, false);
            writeEmptyGivensMask(out);
            out.write(0, EVENT_COUNT_BITS);
            out.write(RATING_TRAILER_VERSION_V1, RATING_TRAILER_VERSION_BITS);
        });
        const decoded = codec.decode(payload);

        expect(decoded.rating).toBe(0);
        expect(decoded.isRatingCeiling).toBe(false);
        expect(decoded.difficulty).toBe(0);
    });

    it('should degrade to the unknown rating sentinel for an unrecognised rating trailer version', () => {
        expect.assertions(3);

        const payload = buildPayload(out => {
            writeHeader(out, SharedPayloadKindEnum.Challenge, false);
            writeEmptyGivensMask(out);
            out.write(0, EVENT_COUNT_BITS);
            out.write(RATING_TRAILER_VERSION_V1 + 1, RATING_TRAILER_VERSION_BITS);
            out.write(45, RATING_VALUE_BITS);
            out.write(1, RATING_CEILING_FLAG_BITS);
            out.write(4, DIFFICULTY_CODE_BITS);
        });
        const decoded = codec.decode(payload);

        expect(decoded.rating).toBe(0);
        expect(decoded.isRatingCeiling).toBe(false);
        expect(decoded.difficulty).toBe(0);
    });
});
