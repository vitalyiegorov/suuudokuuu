import { describe, expect, it } from '@jest/globals';
import { BitOutputStream } from '@thi.ng/bitstream';

import {
    CODEC_RESERVED_BITS,
    CODEC_VERSION,
    CODEC_VERSION_BITS,
    MAX_MISTAKES_BITS,
    STEP_COUNT_BITS,
    VALUE_PAIR_BITS,
    VALUE_TRIPLET_BITS
} from '../../@generic/constants/binary-codec.constant';
import { VALUE_BITS } from '../../@generic/constants/bit-encoding.constant';
import { GRID_CELL_COUNT } from '../../@generic/constants/grid.constant';
import { bytesToBase64url } from '../../@generic/utils/bytes-to-base64url.util';

import { GameStateBinaryCodec } from './game-state-binary-codec';

import type { SolutionStepInterface } from '../../@generic/interfaces/solution-step.interface';

const givensMask = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';
const emptyCellCount = 51;
const invalidPackedTriplet = 1023;
const invalidPackedPair = 127;
const invalidPackedSingle = 15;
const invalidStepCount = 127;
const invalidStepPosition = 127;
const positionBitsForEmptyGrid = 7;

const writeHeader = (out: BitOutputStream, isChallenge: boolean): void => {
    out.write(CODEC_VERSION, CODEC_VERSION_BITS);
    out.write(isChallenge ? 1 : 0, 1);
    out.write(0, CODEC_RESERVED_BITS);
    out.write(3, MAX_MISTAKES_BITS);
};

const writeGivensMask = (out: BitOutputStream, givenCount: number): void => {
    for (let cellIndex = 0; cellIndex < GRID_CELL_COUNT; cellIndex += 1) {
        out.write(cellIndex < givenCount ? 1 : 0, 1);
    }
};

const buildPayload = (writeBody: (out: BitOutputStream) => void): string => {
    const out = new BitOutputStream();

    writeBody(out);

    return bytesToBase64url(out.bytes());
};

describe('GameStateBinaryCodec corrupt payloads', () => {
    const codec = new GameStateBinaryCodec();

    describe('encode guards', () => {
        it('should throw when there are more steps than empty cells', () => {
            expect.assertions(1);

            const tooManySteps: SolutionStepInterface[] = Array.from({ length: emptyCellCount + 1 }, () => ({
                cellIndex: 2,
                value: 4,
                ts: 1
            }));

            expect(() => codec.encode(givensMask, tooManySteps, 3, true)).toThrow('Too many solution steps');
        });
    });

    describe('packed value guards', () => {
        it('should throw when a packed value triplet exceeds the base-9 range', () => {
            expect.assertions(1);

            const payload = buildPayload(out => {
                writeHeader(out, false);
                writeGivensMask(out, 3);
                out.write(invalidPackedTriplet, VALUE_TRIPLET_BITS);
            });

            expect(() => codec.decode(payload)).toThrow('Invalid packed cell values');
        });

        it('should throw when a trailing packed value pair exceeds the base-9 range', () => {
            expect.assertions(1);

            const payload = buildPayload(out => {
                writeHeader(out, false);
                writeGivensMask(out, 2);
                out.write(invalidPackedPair, VALUE_PAIR_BITS);
            });

            expect(() => codec.decode(payload)).toThrow('Invalid packed cell values');
        });

        it('should throw when a trailing single packed value exceeds the base-9 range', () => {
            expect.assertions(1);

            const payload = buildPayload(out => {
                writeHeader(out, false);
                writeGivensMask(out, 1);
                out.write(invalidPackedSingle, VALUE_BITS);
            });

            expect(() => codec.decode(payload)).toThrow('Invalid packed cell values');
        });
    });

    describe('solution step guards', () => {
        it('should throw when the step count exceeds the available empty cells', () => {
            expect.assertions(1);

            const payload = buildPayload(out => {
                writeHeader(out, true);
                writeGivensMask(out, 0);
                out.write(invalidStepCount, STEP_COUNT_BITS);
            });

            expect(() => codec.decode(payload)).toThrow('Invalid solution step count');
        });

        it('should throw when a step position falls outside the empty cells', () => {
            expect.assertions(1);

            const payload = buildPayload(out => {
                writeHeader(out, true);
                writeGivensMask(out, 0);
                out.write(1, STEP_COUNT_BITS);
                out.write(invalidStepPosition, positionBitsForEmptyGrid);
            });

            expect(() => codec.decode(payload)).toThrow('Invalid solution step position');
        });
    });
});
