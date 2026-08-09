/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it } from '@jest/globals';

import { AGGREGATE_COUNT_LARGE_BITS } from '../../@generic/constants/binary-codec.constant';
import { SharedPayloadKindEnum } from '../../@generic/enums/shared-payload-kind.enum';
import { TimelineEventKindEnum } from '../../@generic/enums/timeline-event-kind.enum';

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
    pencilCount: 0,
    screenshotCount: 0,
    rating: 0,
    isRatingCeiling: false,
    difficulty: 0,
    ...overrides
});

describe('GameStateBinaryCodecV3 aggregate trailer', () => {
    const codec = new GameStateBinaryCodecV3();

    it('should round-trip pencil and screenshot counts', () => {
        expect.assertions(2);

        const decoded = codec.decode(codec.encode(buildChallenge({ pencilCount: 17, screenshotCount: 4 })));

        expect(decoded.pencilCount).toBe(17);
        expect(decoded.screenshotCount).toBe(4);
    });

    it('should keep a genuine zero distinguishable from an unknown count', () => {
        expect.assertions(2);

        const decoded = codec.decode(codec.encode(buildChallenge({ pencilCount: 0, screenshotCount: 0 })));

        expect(decoded.pencilCount).toBe(0);
        expect(decoded.screenshotCount).toBe(0);
    });

    it('should clamp counts above the large varint ceiling', () => {
        expect.assertions(1);

        const decoded = codec.decode(codec.encode(buildChallenge({ pencilCount: 2 ** AGGREGATE_COUNT_LARGE_BITS })));

        expect(decoded.pencilCount).toBe(2 ** AGGREGATE_COUNT_LARGE_BITS - 1);
    });

    it('should omit the trailer and report unknown counts when the producer has none', () => {
        expect.assertions(2);

        const decoded = codec.decode(codec.encode(buildChallenge({ pencilCount: null, screenshotCount: null })));

        expect(decoded.pencilCount).toBeNull();
        expect(decoded.screenshotCount).toBeNull();
    });

    it('should report unknown counts for a trailerless payload at every bit alignment', () => {
        expect.assertions(18);

        for (let eventCount = 0; eventCount < 9; eventCount += 1) {
            const trailerless = buildChallenge({
                pencilCount: null,
                screenshotCount: null,
                timelineEvents: buildMarkerEvents(eventCount)
            });
            const decoded = codec.decode(codec.encode(trailerless));

            expect(decoded.pencilCount).toBeNull();
            expect(decoded.screenshotCount).toBeNull();
        }
    });

    it('should leave every pre-trailer field untouched when the trailer is present', () => {
        expect.assertions(1);

        const timelineEvents = buildMarkerEvents(5);
        const withTrailer = codec.decode(codec.encode(buildChallenge({ pencilCount: 9, screenshotCount: 2, timelineEvents })));
        const withoutTrailer = codec.decode(codec.encode(buildChallenge({ pencilCount: null, screenshotCount: null, timelineEvents })));

        expect({ ...withTrailer, pencilCount: null, screenshotCount: null }).toStrictEqual(withoutTrailer);
    });

    it('should keep puzzle payloads byte-identical regardless of known counts', () => {
        expect.assertions(2);

        const puzzle = { ...buildChallenge({}), kind: SharedPayloadKindEnum.Puzzle, isChallengeRun: false };
        const withCounts = codec.encode({ ...puzzle, pencilCount: 12, screenshotCount: 3 });
        const withoutCounts = codec.encode({ ...puzzle, pencilCount: null, screenshotCount: null });

        expect(withCounts).toBe(withoutCounts);
        expect(codec.decode(withCounts).pencilCount).toBeNull();
    });

    it('should carry the trailer on handoff payloads after the handoff extras', () => {
        expect.assertions(3);

        const handoff = {
            ...buildChallenge({}),
            kind: SharedPayloadKindEnum.Handoff,
            score: 4820,
            candidates: { 40: [1, 4, 7] },
            anchorSeconds: 1800000000,
            pencilCount: 6,
            screenshotCount: 1
        };
        const decoded = codec.decode(codec.encode(handoff));

        expect(decoded.score).toBe(4820);
        expect(decoded.pencilCount).toBe(6);
        expect(decoded.screenshotCount).toBe(1);
    });
});
