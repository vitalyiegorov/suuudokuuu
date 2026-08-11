/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it } from '@jest/globals';

import { SharedPayloadKindEnum } from '../../@generic/enums/shared-payload-kind.enum';
import { TimelineEventKindEnum } from '../../@generic/enums/timeline-event-kind.enum';

import { GameStateSerializer } from './game-state-serializer';

const givens = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';

const FROZEN_PUZZLE_PAYLOAD = '_MAPIThhRGUxFDDkJq4zrJuyYhUEGSYmTqA';
const FROZEN_CHALLENGE_PAYLOAD = '_OwPIThhRGUxFDDkJq4zrJuyYhUEGSYmTqAalQDDhYCWCCwEA';
const FROZEN_HANDOFF_PAYLOAD = '_NQPIThhRGUxFDDkJq4zrJuyYhUEGSYmTqAIBh4AJagFQSWtJ0gAQMAQ';

const FROZEN_V1_PUZZLE_PAYLOAD = '_MAPIThhRGUxFDDkJq4zrJuyYhUEGSYmTqNA';
const FROZEN_V1_CHALLENGE_PAYLOAD = '_OwPIThhRGUxFDDkJq4zrJuyYhUEGSYmTqAalQDDhYCWCCwEM';
const FROZEN_V1_HANDOFF_PAYLOAD = '_NQPIThhRGUxFDDkJq4zrJuyYhUEGSYmTqAIBh4AJagFQSWtJ0gAQMARY';
const FROZEN_V1_TRAILERLESS_CHALLENGE_PAYLOAD = '_OQPIThhRGUxFDDkJq4zrJuyYhUEGSYmTqAIBhxQ';

describe('GameStateSerializer frozen pre-difficulty v3 payloads', () => {
    const serializer = new GameStateSerializer();

    it('should decode a frozen puzzle payload with an absent difficulty and an unknown rating', () => {
        expect.assertions(7);

        const decoded = serializer.decodeState(FROZEN_PUZZLE_PAYLOAD);

        expect(decoded.field).toBe(givens);
        expect(decoded.kind).toBe(SharedPayloadKindEnum.Puzzle);
        expect(decoded.maxMistakes).toBe(3);
        expect(decoded.timelineEvents).toStrictEqual([]);
        expect(decoded.difficulty).toBeNull();
        expect(decoded.rating).toBe(0);
        expect(decoded.isRatingCeiling).toBe(false);
    });

    it('should decode a frozen challenge payload with an absent difficulty and an unknown rating', () => {
        expect.assertions(9);

        const decoded = serializer.decodeState(FROZEN_CHALLENGE_PAYLOAD);

        expect(decoded.field).toBe(givens);
        expect(decoded.kind).toBe(SharedPayloadKindEnum.Challenge);
        expect(decoded.isChallengeRun).toBe(true);
        expect(decoded.timelineEvents).toStrictEqual([
            { kind: TimelineEventKindEnum.Cell, cellIndex: 2, value: 4, ts: 7 },
            { kind: TimelineEventKindEnum.Away, ts: 5 },
            { kind: TimelineEventKindEnum.Return, ts: 300 }
        ]);
        expect(decoded.pencilCount).toBe(11);
        expect(decoded.screenshotCount).toBe(2);
        expect(decoded.difficulty).toBeNull();
        expect(decoded.rating).toBe(0);
        expect(decoded.isRatingCeiling).toBe(false);
    });

    it('should decode a frozen handoff payload with an absent difficulty and an unknown rating', () => {
        expect.assertions(10);

        const decoded = serializer.decodeState(FROZEN_HANDOFF_PAYLOAD);

        expect(decoded.field).toBe(givens);
        expect(decoded.kind).toBe(SharedPayloadKindEnum.Handoff);
        expect(decoded.timelineEvents).toStrictEqual([{ kind: TimelineEventKindEnum.Cell, cellIndex: 2, value: 4, ts: 7 }]);
        expect(decoded.score).toBe(4820);
        expect(decoded.candidates).toStrictEqual({ 40: [1, 4, 7] });
        expect(decoded.anchorSeconds).toBe(1800000000);
        expect(decoded.pencilCount).toBe(6);
        expect(decoded.difficulty).toBeNull();
        expect(decoded.rating).toBe(0);
        expect(decoded.isRatingCeiling).toBe(false);
    });
});

describe('GameStateSerializer frozen v2.4.x difficulty-trailer payloads', () => {
    const serializer = new GameStateSerializer();

    it('should decode a frozen v2.4.x puzzle payload with its difficulty and an unknown rating', () => {
        expect.assertions(5);

        const decoded = serializer.decodeState(FROZEN_V1_PUZZLE_PAYLOAD);

        expect(decoded.field).toBe(givens);
        expect(decoded.kind).toBe(SharedPayloadKindEnum.Puzzle);
        expect(decoded.difficulty).toBe(5);
        expect(decoded.rating).toBe(0);
        expect(decoded.isRatingCeiling).toBe(false);
    });

    it('should decode a frozen v2.4.x challenge payload with its difficulty, aggregates, and an unknown rating', () => {
        expect.assertions(7);

        const decoded = serializer.decodeState(FROZEN_V1_CHALLENGE_PAYLOAD);

        expect(decoded.field).toBe(givens);
        expect(decoded.kind).toBe(SharedPayloadKindEnum.Challenge);
        expect(decoded.timelineEvents).toStrictEqual([
            { kind: TimelineEventKindEnum.Cell, cellIndex: 2, value: 4, ts: 7 },
            { kind: TimelineEventKindEnum.Away, ts: 5 },
            { kind: TimelineEventKindEnum.Return, ts: 300 }
        ]);
        expect(decoded.pencilCount).toBe(11);
        expect(decoded.screenshotCount).toBe(2);
        expect(decoded.difficulty).toBe(4);
        expect(decoded.rating).toBe(0);
    });

    it('should decode a frozen v2.4.x handoff payload with its difficulty and an unknown rating', () => {
        expect.assertions(6);

        const decoded = serializer.decodeState(FROZEN_V1_HANDOFF_PAYLOAD);

        expect(decoded.field).toBe(givens);
        expect(decoded.kind).toBe(SharedPayloadKindEnum.Handoff);
        expect(decoded.score).toBe(4820);
        expect(decoded.anchorSeconds).toBe(1800000000);
        expect(decoded.difficulty).toBe(3);
        expect(decoded.rating).toBe(0);
    });

    it('should decode a frozen v2.4.x challenge payload whose difficulty trailer sits where the aggregate trailer would', () => {
        expect.assertions(6);

        const decoded = serializer.decodeState(FROZEN_V1_TRAILERLESS_CHALLENGE_PAYLOAD);

        expect(decoded.field).toBe(givens);
        expect(decoded.kind).toBe(SharedPayloadKindEnum.Challenge);
        expect(decoded.pencilCount).toBeNull();
        expect(decoded.screenshotCount).toBeNull();
        expect(decoded.difficulty).toBe(2);
        expect(decoded.rating).toBe(0);
    });
});

describe('GameStateSerializer frozen payload technique streams', () => {
    const serializer = new GameStateSerializer();

    it('should report unknown techniques for every shipped link generation', () => {
        expect.assertions(7);

        const shippedPayloads = [
            FROZEN_PUZZLE_PAYLOAD,
            FROZEN_CHALLENGE_PAYLOAD,
            FROZEN_HANDOFF_PAYLOAD,
            FROZEN_V1_PUZZLE_PAYLOAD,
            FROZEN_V1_CHALLENGE_PAYLOAD,
            FROZEN_V1_HANDOFF_PAYLOAD,
            FROZEN_V1_TRAILERLESS_CHALLENGE_PAYLOAD
        ];

        for (const payload of shippedPayloads) {
            expect(serializer.decodeState(payload).techniques).toBeNull();
        }
    });
});
