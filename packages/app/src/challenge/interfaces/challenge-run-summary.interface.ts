import type { ChallengeAwayRangeInterface } from './challenge-away-range.interface';
import type { ChallengeTechniqueEventInterface } from './challenge-technique-event.interface';

export interface ChallengeRunSummaryInterface {
    readonly awayRanges: ChallengeAwayRangeInterface[];
    readonly awaySeconds: number;
    readonly exitCount: number;
    readonly pencilCount: number | null;
    readonly screenshotCount: number | null;
    readonly techniqueEvents: ChallengeTechniqueEventInterface[];
}
