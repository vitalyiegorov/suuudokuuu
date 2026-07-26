import type { TimelineEventKindEnum } from '../enums/timeline-event-kind.enum';

export interface TimelineEventStreamsInterface {
    kinds: TimelineEventKindEnum[];
    timestamps: number[];
    cellIndexes: number[];
    cellValues: number[];
    payloadIndexes: number[];
    payloadValues: number[];
}
