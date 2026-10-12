import { TimelineEventKindEnum } from '../enums/timeline-event-kind.enum';

export interface CellTimelineEventInterface {
    readonly kind: TimelineEventKindEnum.Cell;
    readonly cellIndex: number;
    readonly value: number;
    readonly ts: number;
}

interface PayloadTimelineEventInterface {
    readonly kind: TimelineEventKindEnum.Pencil | TimelineEventKindEnum.Mistake;
    readonly cellIndex: number;
    readonly value: number;
    readonly ts: number;
}

type MarkerTimelineEventKindType =
    | TimelineEventKindEnum.InputMode
    | TimelineEventKindEnum.AutoCandidates
    | TimelineEventKindEnum.Away
    | TimelineEventKindEnum.Return
    | TimelineEventKindEnum.Pause
    | TimelineEventKindEnum.Resume
    | TimelineEventKindEnum.Screenshot
    | TimelineEventKindEnum.Hint;

interface MarkerTimelineEventInterface {
    readonly kind: MarkerTimelineEventKindType;
    readonly ts: number;
}

export type TimelineEventInterface = CellTimelineEventInterface | PayloadTimelineEventInterface | MarkerTimelineEventInterface;
