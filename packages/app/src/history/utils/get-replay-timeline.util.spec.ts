/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it } from '@jest/globals';
import { TimelineEventKindEnum } from '@suuudokuuu/encoder';

import { initialGameState } from '../../game/store/game.state';

import { getReplayTimeline } from './get-replay-timeline.util';

import type { GameTimelineEventInterface } from '../../game/interface/game-timeline-event.interface';

const playedBoard = `53${'.'.repeat(79)}`;
const events: GameTimelineEventInterface[] = [
    { kind: TimelineEventKindEnum.Cell, cellIndex: 1, value: 3, ts: 10 },
    { kind: TimelineEventKindEnum.Away, ts: 5 }
];

describe('getReplayTimeline', () => {
    it('should replay the player timeline of a handed off run', () => {
        expect.assertions(2);

        const timeline = getReplayTimeline({ ...initialGameState, sudokuString: playedBoard, timelineEvents: events });

        expect(timeline.events).toStrictEqual(events);
        expect(timeline.givens).toBe(`5${'.'.repeat(80)}`);
    });

    it('should fall back to the challenge timeline of a legacy completed game', () => {
        expect.assertions(2);

        const timeline = getReplayTimeline({
            ...initialGameState,
            sudokuString: `5${'.'.repeat(80)}`,
            challengeTimelineEvents: events
        });

        expect(timeline.events).toStrictEqual(events);
        expect(timeline.givens).toBe(`5${'.'.repeat(80)}`);
    });

    it('should leave the board untouched when there is nothing to replay', () => {
        expect.assertions(2);

        const timeline = getReplayTimeline({ ...initialGameState, sudokuString: playedBoard });

        expect(timeline.events).toStrictEqual([]);
        expect(timeline.givens).toBe(playedBoard);
    });
});
