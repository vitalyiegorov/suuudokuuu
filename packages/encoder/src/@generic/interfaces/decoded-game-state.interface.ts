import type { SharedPayloadKindEnum } from '../enums/shared-payload-kind.enum';
import type { TimelineEventInterface } from './timeline-event.interface';

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
    techniques: (number | null)[] | null;
    rating: number;
    isRatingCeiling: boolean;
    difficulty: number | null;
}
