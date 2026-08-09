/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it } from '@jest/globals';
import { BitOutputStream } from '@thi.ng/bitstream';

import { BYTE_BITS } from '../../@generic/constants/base64url.constant';
import {
    AGGREGATE_TRAILER_MIN_BITS,
    CODEC_VERSION_BITS,
    CODEC_VERSION_V3,
    DIFFICULTY_CODE_MAX,
    EVENT_COUNT_BITS,
    HAS_TAG_STREAM_BITS,
    IS_CHALLENGE_RUN_BITS,
    MAX_MISTAKES_BITS,
    PAYLOAD_KIND_BITS,
    RATING_TRAILER_MIN_BITS,
    RATING_VALUE_MAX
} from '../../@generic/constants/binary-codec.constant';
import { GRID_CELL_COUNT, GRID_EMPTY_CELL } from '../../@generic/constants/grid.constant';
import { SharedPayloadKindEnum } from '../../@generic/enums/shared-payload-kind.enum';
import { TimelineEventKindEnum } from '../../@generic/enums/timeline-event-kind.enum';
import { bytesToBase64url } from '../../@generic/utils/bytes-to-base64url.util';
import { writeGivens } from '../../@generic/utils/givens-codec.util';
import { writeRatingTrailer } from '../../@generic/utils/rating-codec.util';
import { hasNonCellEvents, writeTimelineEvents } from '../../@generic/utils/timeline-event-stream-codec.util';

import { type EncodableGameStateInterface, GameStateBinaryCodecV3 } from './game-state-binary-codec-v3';

import type { TimelineEventInterface } from '../../@generic/interfaces/timeline-event.interface';

const givens = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';

const buildMarkerEvents = (count: number): TimelineEventInterface[] =>
    Array.from({ length: count }, () => ({ kind: TimelineEventKindEnum.AutoCandidates, ts: 3 }));

const buildChallenge = (overrides: Partial<EncodableGameStateInterface>): EncodableGameStateInterface => ({
    field: givens,
    timelineEvents: [],
    kind: SharedPayloadKindEnum.Challenge,
    maxMistakes: 3,
    isChallengeRun: true,
    score: 0,
    candidates: {},
    anchorSeconds: 0,
    pencilCount: null,
    screenshotCount: null,
    rating: 0,
    isRatingCeiling: false,
    difficulty: 0,
    ...overrides
});

const buildFieldWithGivenCount = (givenCount: number): string => {
    let field = '';

    for (let cellIndex = 0; cellIndex < GRID_CELL_COUNT; cellIndex += 1) {
        field += cellIndex < givenCount ? '1' : GRID_EMPTY_CELL;
    }

    return field;
};

const measureRemainingBitsAtAggregateTrailerStart = (givenCount: number): number => {
    const out = new BitOutputStream();

    writeGivens(out, buildFieldWithGivenCount(givenCount));
    out.write(0, EVENT_COUNT_BITS);
    const positionBeforeAggregateTrailer = out.position;

    writeRatingTrailer(out, 87, true, 5);

    return out.bytes().length * BYTE_BITS - positionBeforeAggregateTrailer;
};

const findGivenCountForRemainingBits = (targetRemainingBits: number): number => {
    for (let givenCount = 0; givenCount <= GRID_CELL_COUNT; givenCount += 1) {
        if (measureRemainingBitsAtAggregateTrailerStart(givenCount) === targetRemainingBits) {
            return givenCount;
        }
    }

    throw new Error('No given count reaches the requested bit alignment');
};

const buildTrailerlessChallengePayload = (timelineEvents: TimelineEventInterface[]): string => {
    const hasTagStream = hasNonCellEvents(timelineEvents);
    const out = new BitOutputStream();

    out.write(CODEC_VERSION_V3, CODEC_VERSION_BITS);
    out.write(SharedPayloadKindEnum.Challenge, PAYLOAD_KIND_BITS);
    out.write(hasTagStream ? 1 : 0, HAS_TAG_STREAM_BITS);
    out.write(0, IS_CHALLENGE_RUN_BITS);
    out.write(3, MAX_MISTAKES_BITS);
    writeGivens(out, givens);
    writeTimelineEvents(out, givens, timelineEvents, hasTagStream);

    return bytesToBase64url(out.bytes());
};

describe('GameStateBinaryCodecV3 rating trailer', () => {
    const codec = new GameStateBinaryCodecV3();

    it('should round-trip a known rating and difficulty', () => {
        expect.assertions(3);

        const decoded = codec.decode(codec.encode(buildChallenge({ rating: 68, isRatingCeiling: false, difficulty: 4 })));

        expect(decoded.rating).toBe(68);
        expect(decoded.isRatingCeiling).toBe(false);
        expect(decoded.difficulty).toBe(4);
    });

    it('should round-trip the ceiling flag', () => {
        expect.assertions(1);

        const decoded = codec.decode(codec.encode(buildChallenge({ rating: 100, isRatingCeiling: true })));

        expect(decoded.isRatingCeiling).toBe(true);
    });

    it('should keep the unknown sentinel as a genuine decode result, not an error', () => {
        expect.assertions(3);

        const decoded = codec.decode(codec.encode(buildChallenge({ rating: 0, isRatingCeiling: false, difficulty: 0 })));

        expect(decoded.rating).toBe(0);
        expect(decoded.isRatingCeiling).toBe(false);
        expect(decoded.difficulty).toBe(0);
    });

    it('should clamp a rating above the encodable ceiling', () => {
        expect.assertions(1);

        const decoded = codec.decode(codec.encode(buildChallenge({ rating: RATING_VALUE_MAX + 50 })));

        expect(decoded.rating).toBe(RATING_VALUE_MAX);
    });

    it('should clamp a difficulty above the encodable ceiling', () => {
        expect.assertions(1);

        const decoded = codec.decode(codec.encode(buildChallenge({ difficulty: DIFFICULTY_CODE_MAX + 3 })));

        expect(decoded.difficulty).toBe(DIFFICULTY_CODE_MAX);
    });

    it('should carry rating and difficulty on puzzle payloads, unlike the aggregate trailer', () => {
        expect.assertions(3);

        const puzzle = {
            ...buildChallenge({ rating: 54, isRatingCeiling: true, difficulty: 2 }),
            kind: SharedPayloadKindEnum.Puzzle,
            isChallengeRun: false
        };
        const decoded = codec.decode(codec.encode(puzzle));

        expect(decoded.rating).toBe(54);
        expect(decoded.isRatingCeiling).toBe(true);
        expect(decoded.difficulty).toBe(2);
    });

    it('should report the unknown rating, difficulty, and aggregate counts for a pre-change payload at every bit alignment', () => {
        expect.assertions(45);

        for (let eventCount = 0; eventCount < 9; eventCount += 1) {
            const decoded = codec.decode(buildTrailerlessChallengePayload(buildMarkerEvents(eventCount)));

            expect(decoded.rating).toBe(0);
            expect(decoded.isRatingCeiling).toBe(false);
            expect(decoded.difficulty).toBe(0);
            expect(decoded.pencilCount).toBeNull();
            expect(decoded.screenshotCount).toBeNull();
        }
    });
});

describe('GameStateBinaryCodecV3 rating trailer vs aggregate trailer decode ambiguity', () => {
    const codec = new GameStateBinaryCodecV3();

    it('should exercise the exact remaining-bits collision the aggregate guard used to misparse', () => {
        expect.assertions(1);

        const collidingGivenCount = findGivenCountForRemainingBits(AGGREGATE_TRAILER_MIN_BITS);

        expect(measureRemainingBitsAtAggregateTrailerStart(collidingGivenCount)).toBe(AGGREGATE_TRAILER_MIN_BITS);
    });

    it('should decode null aggregate counts and the real rating at every rating-trailer bit alignment, including the collision case', () => {
        expect.assertions((AGGREGATE_TRAILER_MIN_BITS - RATING_TRAILER_MIN_BITS + 1) * 3);

        for (let remainingBits = RATING_TRAILER_MIN_BITS; remainingBits <= AGGREGATE_TRAILER_MIN_BITS; remainingBits += 1) {
            const givenCount = findGivenCountForRemainingBits(remainingBits);
            const decoded = codec.decode(
                codec.encode(
                    buildChallenge({
                        field: buildFieldWithGivenCount(givenCount),
                        pencilCount: null,
                        screenshotCount: null,
                        rating: 87,
                        isRatingCeiling: true,
                        difficulty: 5
                    })
                )
            );

            expect(decoded.pencilCount).toBeNull();
            expect(decoded.screenshotCount).toBeNull();
            expect(decoded.rating).toBe(87);
        }
    });
});
