import { isDefined } from '@rnw-community/shared';

import { ChallengeTechniqueTierEnum } from '../enums/challenge-technique-tier.enum';

import type { ChallengeTechniqueEventInterface } from '../interfaces/challenge-technique-event.interface';
import type { SolutionTechniqueEnum } from '@suuudokuuu/solver';

export interface ChallengeTechniqueSummaryItemInterface {
    technique: SolutionTechniqueEnum;
    tier: ChallengeTechniqueTierEnum;
    count: number;
}

const tierRank: Record<ChallengeTechniqueTierEnum, number> = {
    [ChallengeTechniqueTierEnum.Advanced]: 4,
    [ChallengeTechniqueTierEnum.Guess]: 3,
    [ChallengeTechniqueTierEnum.Clever]: 2,
    [ChallengeTechniqueTierEnum.Basic]: 1
};

export const getChallengeTechniqueSummary = (events: ChallengeTechniqueEventInterface[]): ChallengeTechniqueSummaryItemInterface[] => {
    const countByTechnique = new Map<SolutionTechniqueEnum, ChallengeTechniqueSummaryItemInterface>();

    for (const event of events) {
        const existing = countByTechnique.get(event.technique);

        if (isDefined(existing)) {
            existing.count += 1;
        } else {
            countByTechnique.set(event.technique, { technique: event.technique, tier: event.tier, count: 1 });
        }
    }

    return [...countByTechnique.values()].sort((first, second) => {
        const tierDifference = tierRank[second.tier] - tierRank[first.tier];

        return tierDifference === 0 ? second.count - first.count : tierDifference;
    });
};
