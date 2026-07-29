import { SharedPayloadKindEnum } from '../enums/shared-payload-kind.enum';
import { TimelineEventKindEnum } from '../enums/timeline-event-kind.enum';

export const payloadKindByCode: Record<number, SharedPayloadKindEnum> = {
    [SharedPayloadKindEnum.Puzzle]: SharedPayloadKindEnum.Puzzle,
    [SharedPayloadKindEnum.Handoff]: SharedPayloadKindEnum.Handoff,
    [SharedPayloadKindEnum.Challenge]: SharedPayloadKindEnum.Challenge
};

export const timelineEventKindByCode: Record<number, TimelineEventKindEnum> = {
    [TimelineEventKindEnum.Cell]: TimelineEventKindEnum.Cell,
    [TimelineEventKindEnum.Pencil]: TimelineEventKindEnum.Pencil,
    [TimelineEventKindEnum.InputMode]: TimelineEventKindEnum.InputMode,
    [TimelineEventKindEnum.AutoCandidates]: TimelineEventKindEnum.AutoCandidates,
    [TimelineEventKindEnum.Mistake]: TimelineEventKindEnum.Mistake,
    [TimelineEventKindEnum.Away]: TimelineEventKindEnum.Away,
    [TimelineEventKindEnum.Return]: TimelineEventKindEnum.Return,
    [TimelineEventKindEnum.Pause]: TimelineEventKindEnum.Pause,
    [TimelineEventKindEnum.Resume]: TimelineEventKindEnum.Resume,
    [TimelineEventKindEnum.Screenshot]: TimelineEventKindEnum.Screenshot
};

export const cellPayloadKinds: TimelineEventKindEnum[] = [TimelineEventKindEnum.Pencil, TimelineEventKindEnum.Mistake];
