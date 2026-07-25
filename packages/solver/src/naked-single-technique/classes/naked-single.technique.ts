import { isDefined } from '@rnw-community/shared';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createPlacementResult } from '../../@generic/utils/create-placement-result.util';

import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';

export class NakedSingleTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.NakedSingle;

    find(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const cell of context.getBlankCells()) {
            const candidates = context.getCandidates(cell);
            const [value] = candidates;

            if (candidates.length === 1 && isDefined(value)) {
                results.push(createPlacementResult(this.technique, cell, value, [cell]));
            }
        }

        return results;
    }
}
