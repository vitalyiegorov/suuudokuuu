import { describe, expect, it } from '@jest/globals';
import { TimelineEventKindEnum } from '@suuudokuuu/encoder';

import { getTimelineMistakesCount } from './get-timeline-mistakes-count.util';

import type { TimelineEventInterface } from '@suuudokuuu/encoder';

describe('getTimelineMistakesCount', () => {
    it('should count only mistake events', () => {
        expect.assertions(1);

        const events: TimelineEventInterface[] = [
            { kind: TimelineEventKindEnum.Cell, cellIndex: 0, value: 5, ts: 1 },
            { kind: TimelineEventKindEnum.Mistake, cellIndex: 1, value: 3, ts: 2 },
            { kind: TimelineEventKindEnum.Away, ts: 3 },
            { kind: TimelineEventKindEnum.Mistake, cellIndex: 2, value: 7, ts: 4 }
        ];

        expect(getTimelineMistakesCount(events)).toBe(2);
    });

    it('should return zero for an empty timeline', () => {
        expect.assertions(1);

        expect(getTimelineMistakesCount([])).toBe(0);
    });
});
