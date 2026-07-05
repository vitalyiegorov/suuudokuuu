import { isDefined } from '@rnw-community/shared';

import { AbstractTechnique } from '../../@generic/classes/abstract-technique';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';

import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';

export class NakedSingleTechnique extends AbstractTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.NakedSingle;

    find(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const cell of context.getBlankCells()) {
            const candidates = context.getCandidates(cell);
            const [value] = candidates;

            if (candidates.length === 1 && isDefined(value)) {
                results.push(this.createPlacement(this.technique, cell, value, [cell]));
            }
        }

        return results;
    }
}
