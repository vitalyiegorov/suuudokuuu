import { seTechniqueRatings } from '@suuudokuuu/rating';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { isPositiveNumber } from '@rnw-community/shared';

import { isSolutionTechnique } from '../type-guard/is-solution-technique.type-guard';

import type { TechniqueUsageInterface } from '../interfaces/technique-usage.interface';

export const historyGetTechniqueUsageList = (
    techniqueUsageCounts: Partial<Record<SolutionTechniqueEnum, number>>
): readonly TechniqueUsageInterface[] =>
    Object.values(SolutionTechniqueEnum)
        .filter(isSolutionTechnique)
        .map(technique => ({
            technique,
            count: techniqueUsageCounts[technique] ?? 0,
            seValue: seTechniqueRatings[technique]
        }))
        .filter(usage => isPositiveNumber(usage.count))
        .sort((first, second) => second.seValue - first.seValue || first.technique - second.technique);
