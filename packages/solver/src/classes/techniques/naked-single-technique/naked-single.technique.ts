import { isDefined } from '@rnw-community/shared';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { AbstractTechnique } from '../abstract-technique';

import type { TechniqueResultInterface } from '../../../interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../../interfaces/technique-strategy.interface';
import type { CandidateContext } from '../candidate-context/candidate-context';

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
