import { isDefined } from '@rnw-community/shared';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createPlacementResult } from '../../@generic/utils/create-placement-result.util';

import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';

const byPosition = (left: { x: number; y: number }, right: { x: number; y: number }): number => left.y - right.y || left.x - right.x;

export class NakedSingleTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.NakedSingle;

    find(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const cell of context.getBlankCells()) {
            const candidates = context.getCandidates(cell);
            const [value] = candidates;

            if (candidates.length === 1 && isDefined(value)) {
                const filledPeers = context
                    .getPeers(cell)
                    .filter(peer => !context.isBlankCell(peer))
                    .sort(byPosition);

                results.push(createPlacementResult(this.technique, cell, value, [cell, ...filledPeers]));
            }
        }

        return results;
    }
}
