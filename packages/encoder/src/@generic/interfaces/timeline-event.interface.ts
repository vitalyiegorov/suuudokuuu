import { TimelineEventKindEnum } from '../enums/timeline-event-kind.enum';

export interface CellTimelineEventInterface {
    kind: TimelineEventKindEnum.Cell;
    cellIndex: number;
    value: number;
    ts: number;
}

export interface PayloadTimelineEventInterface {
    kind: TimelineEventKindEnum.Pencil | TimelineEventKindEnum.Mistake;
    cellIndex: number;
    value: number;
    ts: number;
}

export type MarkerTimelineEventKindType =
    | TimelineEventKindEnum.InputMode
    | TimelineEventKindEnum.AutoCandidates
    | TimelineEventKindEnum.Away
    | TimelineEventKindEnum.Return
    | TimelineEventKindEnum.Pause
    | TimelineEventKindEnum.Resume;

export interface MarkerTimelineEventInterface {
    kind: MarkerTimelineEventKindType;
    ts: number;
}

export type TimelineEventInterface = CellTimelineEventInterface | PayloadTimelineEventInterface | MarkerTimelineEventInterface;
