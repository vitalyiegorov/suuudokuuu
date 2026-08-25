import { describe, expect, it } from '@jest/globals';
import { TimelineEventKindEnum } from '@suuudokuuu/encoder';

import { gameTakeLastTimelineCellEvent } from './game-take-last-timeline-cell-event.util';

import type { GameTimelineEventInterface } from '../interface/game-timeline-event.interface';

const firstPlacement: GameTimelineEventInterface = { kind: TimelineEventKindEnum.Cell, cellIndex: 1, value: 3, ts: 4 };
const lastPlacement: GameTimelineEventInterface = { kind: TimelineEventKindEnum.Cell, cellIndex: 7, value: 9, ts: 6 };

describe('gameTakeLastTimelineCellEvent', () => {
    it('removes and returns the most recent placement', () => {
        expect.assertions(2);

        const events: GameTimelineEventInterface[] = [firstPlacement, lastPlacement];

        expect(gameTakeLastTimelineCellEvent(events)).toStrictEqual(lastPlacement);
        expect(events).toStrictEqual([firstPlacement]);
    });

    it('carries the think time of the removed placement into the next event', () => {
        expect.assertions(1);

        const events: GameTimelineEventInterface[] = [firstPlacement, { kind: TimelineEventKindEnum.Away, ts: 2 }];

        gameTakeLastTimelineCellEvent(events);

        expect(events).toStrictEqual([{ kind: TimelineEventKindEnum.Away, ts: 6 }]);
    });

    it('skips markers that were recorded after the placement', () => {
        expect.assertions(2);

        const events: GameTimelineEventInterface[] = [lastPlacement, { kind: TimelineEventKindEnum.Hint, ts: 1 }];

        expect(gameTakeLastTimelineCellEvent(events)).toStrictEqual(lastPlacement);
        expect(events).toStrictEqual([{ kind: TimelineEventKindEnum.Hint, ts: 7 }]);
    });

    it('returns nothing when the timeline holds no placement', () => {
        expect.assertions(2);

        const events: GameTimelineEventInterface[] = [{ kind: TimelineEventKindEnum.Mistake, cellIndex: 2, value: 5, ts: 3 }];

        expect(gameTakeLastTimelineCellEvent(events)).toBeNull();
        expect(events).toHaveLength(1);
    });
});
