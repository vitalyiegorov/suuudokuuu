import type { TimelineEventInterface } from './timeline-event.interface';
import type { SharedPayloadKindEnum } from '../enums/shared-payload-kind.enum';

export interface DecodedGameStateInterface {
    field: string;
    timelineEvents: TimelineEventInterface[];
    kind: SharedPayloadKindEnum;
    maxMistakes: number;
    elapsedTime: number;
    isChallengeRun: boolean;
    score: number;
    candidates: Record<number, number[]>;
    anchorSeconds: number;
    pencilCount: number | null;
    screenshotCount: number | null;
}
