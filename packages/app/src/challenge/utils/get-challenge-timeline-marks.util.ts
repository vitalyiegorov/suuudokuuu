import { techniqueComplexityConstant } from '../constants/technique-complexity.constant';
import { ChallengeTechniqueTierEnum } from '../enums/challenge-technique-tier.enum';

import type { ChallengeTechniqueEventInterface } from '../interfaces/challenge-technique-event.interface';

export interface ChallengeTimelineMarkInterface {
    complexity: number;
    tier: ChallengeTechniqueTierEnum | null;
}

const PERCENT = 100;

export const getChallengeTimelineMarks = (
    events: ChallengeTechniqueEventInterface[],
    tickCount: number
): ChallengeTimelineMarkInterface[] => {
    const marks: ChallengeTimelineMarkInterface[] = Array.from({ length: tickCount }, () => ({ complexity: 0, tier: null }));

    for (const event of events) {
        const isSharp = event.tier === ChallengeTechniqueTierEnum.Clever || event.tier === ChallengeTechniqueTierEnum.Advanced;
        const slot = Math.min(tickCount - 1, Math.round((event.positionPercent / PERCENT) * (tickCount - 1)));
        const complexity = isSharp ? techniqueComplexityConstant[event.technique] : 0;
        const existingMark = marks[slot];

        if (existingMark.tier === null || complexity > existingMark.complexity) {
            marks[slot] = { complexity, tier: event.tier };
        }
    }

    return marks;
};
