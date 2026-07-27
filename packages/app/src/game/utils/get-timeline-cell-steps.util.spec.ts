import { describe, expect, it } from '@jest/globals';
import { TimelineEventKindEnum } from '@suuudokuuu/encoder';

import { getTimelineCellSteps } from './get-timeline-cell-steps.util';

import type { GameTimelineEventInterface } from '../interface/game-timeline-event.interface';

describe('getTimelineCellSteps', () => {
    it('should return no steps for an empty timeline', () => {
        expect.assertions(1);

        expect(getTimelineCellSteps([])).toStrictEqual([]);
    });

    it('should map cell events to solution steps', () => {
        expect.assertions(1);

        const events: GameTimelineEventInterface[] = [
            { kind: TimelineEventKindEnum.Cell, cellIndex: 2, value: 4, ts: 10 },
            { kind: TimelineEventKindEnum.Cell, cellIndex: 5, value: 6, ts: 20 }
        ];

        expect(getTimelineCellSteps(events)).toStrictEqual([
            { cellIndex: 2, value: 4, ts: 10 },
            { cellIndex: 5, value: 6, ts: 20 }
        ]);
    });

    it('should drop marker events', () => {
        expect.assertions(1);

        const events: GameTimelineEventInterface[] = [
            { kind: TimelineEventKindEnum.Cell, cellIndex: 2, value: 4, ts: 10 },
            { kind: TimelineEventKindEnum.Away, ts: 5 },
            { kind: TimelineEventKindEnum.Return, ts: 300 },
            { kind: TimelineEventKindEnum.InputMode, ts: 1 }
        ];

        expect(getTimelineCellSteps(events)).toStrictEqual([{ cellIndex: 2, value: 4, ts: 10 }]);
    });

    it('should drop pencil and mistake events even though they carry a cell index', () => {
        expect.assertions(1);

        const events: GameTimelineEventInterface[] = [
            { kind: TimelineEventKindEnum.Pencil, cellIndex: 3, value: 7, ts: 1 },
            { kind: TimelineEventKindEnum.Mistake, cellIndex: 4, value: 2, ts: 1 },
            { kind: TimelineEventKindEnum.Cell, cellIndex: 8, value: 9, ts: 3 }
        ];

        expect(getTimelineCellSteps(events)).toStrictEqual([{ cellIndex: 8, value: 9, ts: 3 }]);
    });

    it('should not carry the locally derived technique into the solution step', () => {
        expect.assertions(1);

        const events: GameTimelineEventInterface[] = [{ kind: TimelineEventKindEnum.Cell, cellIndex: 2, value: 4, ts: 10 }];

        expect(Object.keys(getTimelineCellSteps(events)[0])).toStrictEqual(['cellIndex', 'value', 'ts']);
    });
});
