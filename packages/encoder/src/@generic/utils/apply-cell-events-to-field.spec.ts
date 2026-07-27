/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it } from '@jest/globals';

import { TimelineEventKindEnum } from '../enums/timeline-event-kind.enum';

import { applyCellEventsToField, removeCellEventsFromField } from './timeline-event-stream-codec.util';

import type { TimelineEventInterface } from '../interfaces/timeline-event.interface';

const field = '.'.repeat(81);

describe('applyCellEventsToField', () => {
    it('should write cell event values back into the field', () => {
        expect.assertions(2);

        const events: TimelineEventInterface[] = [
            { kind: TimelineEventKindEnum.Cell, cellIndex: 0, value: 5, ts: 0 },
            { kind: TimelineEventKindEnum.Cell, cellIndex: 80, value: 9, ts: 1 }
        ];

        const result = applyCellEventsToField(field, events);

        expect(result[0]).toBe('5');
        expect(result[80]).toBe('9');
    });

    it('should ignore events that do not fill a cell', () => {
        expect.assertions(1);

        const events: TimelineEventInterface[] = [
            { kind: TimelineEventKindEnum.Away, ts: 0 },
            { kind: TimelineEventKindEnum.Mistake, cellIndex: 3, value: 7, ts: 1 },
            { kind: TimelineEventKindEnum.Pencil, cellIndex: 4, value: 2, ts: 2 }
        ];

        expect(applyCellEventsToField(field, events)).toBe(field);
    });

    it('should restore a field that was stripped of its cell events', () => {
        expect.assertions(1);

        const playedField = `53..7${'.'.repeat(76)}`;
        const events: TimelineEventInterface[] = [
            { kind: TimelineEventKindEnum.Cell, cellIndex: 0, value: 5, ts: 0 },
            { kind: TimelineEventKindEnum.Cell, cellIndex: 4, value: 7, ts: 1 }
        ];

        expect(applyCellEventsToField(removeCellEventsFromField(playedField, events), events)).toBe(playedField);
    });
});
