import type { SharedPayloadKindEnum } from '../enums/shared-payload-kind.enum';
import type { TimelineEventInterface } from './timeline-event.interface';

export interface DecodedGameStateInterface {
    readonly field: string;
    readonly timelineEvents: TimelineEventInterface[];
    readonly kind: SharedPayloadKindEnum;
    readonly maxMistakes: number;
    readonly elapsedTime: number;
    readonly isChallengeRun: boolean;
    readonly score: number;
    readonly candidates: Record<number, number[]>;
    readonly anchorSeconds: number;
    readonly pencilCount: number | null;
    readonly screenshotCount: number | null;
    readonly techniques: (number | null)[] | null;
    readonly hints: boolean[] | null;
    readonly rating: number;
    readonly isRatingCeiling: boolean;
    readonly difficulty: number | null;
}
