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

const solvedBoard = '534678912672195348198342567859761423426853791713924856961537284287419635345286179';
const BlankCell = '.';

const buildCellEvents = (count: number, ts: number): TimelineEventInterface[] => {
    const events: TimelineEventInterface[] = [];

    for (let cellIndex = 0; cellIndex < givens.length && events.length < count; cellIndex += 1) {
        if (givens.charAt(cellIndex) === BlankCell) {
            events.push({ kind: TimelineEventKindEnum.Cell, cellIndex, value: parseInt(solvedBoard.charAt(cellIndex), 10), ts });
        }
    }

    return events;
};

const encodeChallenge = (codec: GameStateBinaryCodecV3, timelineEvents: TimelineEventInterface[]): string =>
    codec.encode({
        field: givens,
        timelineEvents,
        kind: SharedPayloadKindEnum.Challenge,
        maxMistakes: 3,
        isChallengeRun: true,
        score: 0,
        candidates: {},
        anchorSeconds: 0
    });

describe('GameStateBinaryCodecV3 challenge payloads', () => {
    const codec = new GameStateBinaryCodecV3();

    it('should round-trip cell events', () => {
        expect.assertions(1);

        const events = buildCellEvents(5, 10);

        expect(codec.decode(encodeChallenge(codec, events)).timelineEvents).toStrictEqual(events);
    });

    it('should report elapsed time as the sum of every timestamp', () => {
        expect.assertions(1);

        expect(codec.decode(encodeChallenge(codec, buildCellEvents(4, 10))).elapsedTime).toBe(40);
    });

    it('should round-trip an away and return marker pair', () => {
        expect.assertions(1);

        const events: TimelineEventInterface[] = [
            ...buildCellEvents(1, 10),
            { kind: TimelineEventKindEnum.Away, ts: 5 },
            { kind: TimelineEventKindEnum.Return, ts: 300 }
        ];

        expect(codec.decode(encodeChallenge(codec, events)).timelineEvents).toStrictEqual(events);
    });

    it('should round-trip an away period longer than the old 255 second clamp', () => {
        expect.assertions(1);

        const events: TimelineEventInterface[] = [
            { kind: TimelineEventKindEnum.Away, ts: 0 },
            { kind: TimelineEventKindEnum.Return, ts: 4000 }
        ];

        expect(codec.decode(encodeChallenge(codec, events)).timelineEvents).toStrictEqual(events);
    });

    it('should round-trip a mistake event payload', () => {
        expect.assertions(1);

        const events: TimelineEventInterface[] = [
            { kind: TimelineEventKindEnum.Mistake, cellIndex: 80, value: 9, ts: 3 },
            ...buildCellEvents(1, 7)
        ];

        expect(codec.decode(encodeChallenge(codec, events)).timelineEvents).toStrictEqual(events);
    });

    it('should round-trip a mistake at cell index zero', () => {
        expect.assertions(1);

        const events: TimelineEventInterface[] = [{ kind: TimelineEventKindEnum.Mistake, cellIndex: 0, value: 1, ts: 3 }];

        expect(codec.decode(encodeChallenge(codec, events)).timelineEvents).toStrictEqual(events);
    });

    it('should round-trip an auto candidates marker', () => {
        expect.assertions(1);

        const events: TimelineEventInterface[] = [{ kind: TimelineEventKindEnum.AutoCandidates, ts: 12 }];

        expect(codec.decode(encodeChallenge(codec, events)).timelineEvents).toStrictEqual(events);
    });

    it('should round-trip every event kind', () => {
        expect.assertions(1);

        const events: TimelineEventInterface[] = [
            { kind: TimelineEventKindEnum.Pencil, cellIndex: 3, value: 7, ts: 1 },
            { kind: TimelineEventKindEnum.InputMode, ts: 1 },
            { kind: TimelineEventKindEnum.AutoCandidates, ts: 1 },
            { kind: TimelineEventKindEnum.Mistake, cellIndex: 4, value: 2, ts: 1 },
            { kind: TimelineEventKindEnum.Away, ts: 1 },
            { kind: TimelineEventKindEnum.Return, ts: 1 },
            { kind: TimelineEventKindEnum.Pause, ts: 1 },
            { kind: TimelineEventKindEnum.Resume, ts: 1 }
        ];

        expect(codec.decode(encodeChallenge(codec, events)).timelineEvents).toStrictEqual(events);
    });

    it('should omit the tag stream when every event is a cell event', () => {
        expect.assertions(1);

        const cellOnly = encodeChallenge(codec, buildCellEvents(5, 10));
        const withMarker = encodeChallenge(codec, [...buildCellEvents(5, 10), { kind: TimelineEventKindEnum.Away, ts: 1 }]);

        expect(cellOnly.length).toBeLessThan(withMarker.length);
    });

    it('should round-trip an empty event list', () => {
        expect.assertions(2);

        const decoded = codec.decode(encodeChallenge(codec, []));

        expect(decoded.timelineEvents).toStrictEqual([]);
        expect(decoded.elapsedTime).toBe(0);
    });

    it('should throw when the event count exceeds the encodable limit', () => {
        expect.assertions(1);

        const tooManyEvents: TimelineEventInterface[] = Array.from({ length: 1024 }, () => ({
            kind: TimelineEventKindEnum.Away,
            ts: 1
        }));

        expect(() => encodeChallenge(codec, tooManyEvents)).toThrow('Too many timeline events');
    });

    it('should throw when there are more cell events than empty cells', () => {
        expect.assertions(1);

        const duplicated: TimelineEventInterface[] = [
            { kind: TimelineEventKindEnum.Cell, cellIndex: 2, value: 4, ts: 1 },
            { kind: TimelineEventKindEnum.Cell, cellIndex: 2, value: 4, ts: 1 }
        ];

        expect(() => encodeChallenge(codec, duplicated)).toThrow('Invalid timeline cell event');
    });

    it('should round-trip the is challenge run flag', () => {
        expect.assertions(1);

        expect(codec.decode(encodeChallenge(codec, [])).isChallengeRun).toBe(true);
    });
});
