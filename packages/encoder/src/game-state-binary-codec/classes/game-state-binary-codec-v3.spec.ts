/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it } from '@jest/globals';

import { SharedPayloadKindEnum } from '../../@generic/enums/shared-payload-kind.enum';
import { TimelineEventKindEnum } from '../../@generic/enums/timeline-event-kind.enum';

import { GameStateBinaryCodecV3 } from './game-state-binary-codec-v3';

import type { TimelineEventInterface } from '../../@generic/interfaces/timeline-event.interface';

const givens = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';

const encodePuzzle = (codec: GameStateBinaryCodecV3, maxMistakes: number, timelineEvents: TimelineEventInterface[] = []): string =>
    codec.encode({
        field: givens,
        timelineEvents,
        kind: SharedPayloadKindEnum.Puzzle,
        maxMistakes,
        isChallengeRun: false,
        score: 0,
        candidates: {},
        anchorSeconds: 0
    });

describe('GameStateBinaryCodecV3 puzzle payloads', () => {
    const codec = new GameStateBinaryCodecV3();

    it('should round-trip the givens field', () => {
        expect.assertions(1);

        expect(codec.decode(encodePuzzle(codec, 3)).field).toBe(givens);
    });

    it('should round-trip the payload kind and max mistakes', () => {
        expect.assertions(2);

        const decoded = codec.decode(encodePuzzle(codec, 99));

        expect(decoded.kind).toBe(SharedPayloadKindEnum.Puzzle);
        expect(decoded.maxMistakes).toBe(99);
    });

    it('should clamp max mistakes above the encodable limit', () => {
        expect.assertions(1);

        expect(codec.decode(encodePuzzle(codec, 999)).maxMistakes).toBe(255);
    });

    it('should carry no events for a puzzle payload even when events are passed', () => {
        expect.assertions(2);

        const decoded = codec.decode(encodePuzzle(codec, 3, [{ kind: TimelineEventKindEnum.Cell, cellIndex: 2, value: 4, ts: 5 }]));

        expect(decoded.timelineEvents).toStrictEqual([]);
        expect(decoded.elapsedTime).toBe(0);
    });

    it('should throw for a field of the wrong length', () => {
        expect.assertions(1);

        expect(() =>
            codec.encode({
                field: '.'.repeat(80),
                timelineEvents: [],
                kind: SharedPayloadKindEnum.Puzzle,
                maxMistakes: 3,
                isChallengeRun: false,
                score: 0,
                candidates: {},
                anchorSeconds: 0
            })
        ).toThrow('Invalid sudoku field length');
    });

    it('should produce only url path safe characters', () => {
        expect.assertions(1);

        expect(encodePuzzle(codec, 3)).toMatch(/^[\w-]*$/u);
    });
});
