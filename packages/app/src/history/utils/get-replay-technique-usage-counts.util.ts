import type { ChallengeTechniqueEventInterface } from '../../challenge/interfaces/challenge-technique-event.interface';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export const getReplayTechniqueUsageCounts = (
    techniqueEvents: readonly ChallengeTechniqueEventInterface[]
): Partial<Record<SolutionTechniqueEnum, number>> => {
    const usageCounts: Partial<Record<SolutionTechniqueEnum, number>> = {};

    for (const event of techniqueEvents) {
        usageCounts[event.technique] = (usageCounts[event.technique] ?? 0) + 1;
    }

    return usageCounts;
};
