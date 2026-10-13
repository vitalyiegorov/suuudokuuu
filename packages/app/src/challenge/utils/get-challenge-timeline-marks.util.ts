import { isPositiveNumber } from '@rnw-community/shared';

import { techniqueComplexityConstant } from '../constants/technique-complexity.constant';
import { ChallengeTechniqueTierEnum } from '../enums/challenge-technique-tier.enum';

import { getChallengeTimelineSlot } from './get-challenge-timeline-slot.util';

import type { ChallengeTechniqueEventInterface } from '../interfaces/challenge-technique-event.interface';
import type { ChallengeTapeMarkInterface } from './get-challenge-tape-marks.util';

export const getChallengeTimelineMarks = (
    events: ChallengeTechniqueEventInterface[],
    tickCount: number,
    totalTime: number
): ChallengeTapeMarkInterface[] => {
    const marks: ChallengeTapeMarkInterface[] = Array.from({ length: tickCount }, () => ({ complexity: 0, isAway: false, tier: null }));

    if (!isPositiveNumber(totalTime)) {
        return marks;
    }

    for (const event of events) {
        const isSharp = event.tier === ChallengeTechniqueTierEnum.Clever || event.tier === ChallengeTechniqueTierEnum.Advanced;
        const slot = getChallengeTimelineSlot(event.cumulativeTime, totalTime, tickCount);
        const complexity = isSharp ? techniqueComplexityConstant[event.technique] : 0;
        const existingMark = marks[slot];

        if (existingMark.tier === null || complexity > existingMark.complexity) {
            marks[slot] = { complexity, isAway: false, tier: event.tier };
        }
    }

    return marks;
};
