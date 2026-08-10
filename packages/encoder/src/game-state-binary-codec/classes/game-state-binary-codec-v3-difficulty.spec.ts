/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it } from '@jest/globals';

import { DIFFICULTY_CODE_MAX } from '../../@generic/constants/binary-codec.constant';
import { SharedPayloadKindEnum } from '../../@generic/enums/shared-payload-kind.enum';
import { TimelineEventKindEnum } from '../../@generic/enums/timeline-event-kind.enum';

import { type EncodableGameStateInterface, GameStateBinaryCodecV3 } from './game-state-binary-codec-v3';

import type { TimelineEventInterface } from '../../@generic/interfaces/timeline-event.interface';

const givens = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';

const OUT_OF_RANGE_DIFFICULTY_CODE = DIFFICULTY_CODE_MAX + 1;

const buildMarkerEvents = (count: number): TimelineEventInterface[] =>
    Array.from({ length: count }, () => ({ kind: TimelineEventKindEnum.AutoCandidates, ts: 3 }));

const buildState = (overrides: Partial<EncodableGameStateInterface>): EncodableGameStateInterface => ({
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
    difficulty: null,
    ...overrides
});

describe('GameStateBinaryCodecV3 difficulty trailer', () => {
    const codec = new GameStateBinaryCodecV3();

    it.each([0, 1, 2, 3, 4, DIFFICULTY_CODE_MAX])('should round-trip the difficulty code %s on a challenge payload', difficulty => {
        expect.assertions(1);

        expect(codec.decode(codec.encode(buildState({ difficulty }))).difficulty).toBe(difficulty);
    });

    it('should round-trip the difficulty on a puzzle payload', () => {
        expect.assertions(1);

        const puzzle = buildState({ kind: SharedPayloadKindEnum.Puzzle, isChallengeRun: false, difficulty: DIFFICULTY_CODE_MAX });

        expect(codec.decode(codec.encode(puzzle)).difficulty).toBe(DIFFICULTY_CODE_MAX);
    });

    it('should round-trip the difficulty on a handoff payload alongside the handoff extras', () => {
        expect.assertions(4);

        const handoff = buildState({
            kind: SharedPayloadKindEnum.Handoff,
            score: 4820,
            candidates: { 40: [1, 4, 7] },
            anchorSeconds: 1800000000,
            pencilCount: 6,
            screenshotCount: 1,
            difficulty: 4
        });
        const decoded = codec.decode(codec.encode(handoff));

        expect(decoded.difficulty).toBe(4);
        expect(decoded.score).toBe(4820);
        expect(decoded.pencilCount).toBe(6);
        expect(decoded.anchorSeconds).toBe(1800000000);
    });

    it('should report an absent difficulty when the producer has none', () => {
        expect.assertions(1);

        expect(codec.decode(codec.encode(buildState({ difficulty: null }))).difficulty).toBeNull();
    });

    it('should report an absent difficulty for a code above the encodable range', () => {
        expect.assertions(1);

        const decoded = codec.decode(codec.encode(buildState({ difficulty: OUT_OF_RANGE_DIFFICULTY_CODE })));

        expect(decoded.difficulty).toBeNull();
    });

    it('should report an absent difficulty for a negative code', () => {
        expect.assertions(1);

        expect(codec.decode(codec.encode(buildState({ difficulty: -1 }))).difficulty).toBeNull();
    });

    it('should report an absent difficulty for a trailerless payload at every bit alignment', () => {
        expect.assertions(9);

        for (let eventCount = 0; eventCount < 9; eventCount += 1) {
            const trailerless = buildState({ difficulty: null, timelineEvents: buildMarkerEvents(eventCount) });

            expect(codec.decode(codec.encode(trailerless)).difficulty).toBeNull();
        }
    });

    it('should carry the difficulty at every bit alignment', () => {
        expect.assertions(9);

        for (let eventCount = 0; eventCount < 9; eventCount += 1) {
            const state = buildState({ difficulty: 2, timelineEvents: buildMarkerEvents(eventCount) });

            expect(codec.decode(codec.encode(state)).difficulty).toBe(2);
        }
    });

    it('should carry the difficulty when the aggregate trailer is absent', () => {
        expect.assertions(3);

        const decoded = codec.decode(codec.encode(buildState({ pencilCount: null, screenshotCount: null, difficulty: 3 })));

        expect(decoded.difficulty).toBe(3);
        expect(decoded.pencilCount).toBeNull();
        expect(decoded.screenshotCount).toBeNull();
    });

    it('should leave every pre-trailer field untouched when the difficulty is present', () => {
        expect.assertions(1);

        const timelineEvents = buildMarkerEvents(5);
        const withDifficulty = codec.decode(codec.encode(buildState({ difficulty: DIFFICULTY_CODE_MAX, timelineEvents })));
        const withoutDifficulty = codec.decode(codec.encode(buildState({ difficulty: null, timelineEvents })));

        expect({ ...withDifficulty, difficulty: null }).toStrictEqual(withoutDifficulty);
    });

    it('should keep payloads byte-identical when no difficulty is supplied', () => {
        expect.assertions(1);

        const withInvalidDifficulty = codec.encode(buildState({ difficulty: OUT_OF_RANGE_DIFFICULTY_CODE }));
        const withoutDifficulty = codec.encode(buildState({ difficulty: null }));

        expect(withInvalidDifficulty).toBe(withoutDifficulty);
    });
});
