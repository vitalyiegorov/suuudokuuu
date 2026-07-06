import { isDefined } from '@rnw-community/shared';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { canSee } from '../../@generic/utils/can-see.util';
import { createEliminationResults } from '../../@generic/utils/create-elimination-results.util';
import { getCombinations } from '../../@generic/utils/get-combinations.util';
import { getCommonPeerEliminations } from '../../@generic/utils/get-common-peer-eliminations.util';
import { hasSameCandidates } from '../../@generic/utils/has-same-candidates.util';
import { hasStrongLinkBetween } from '../../@generic/utils/has-strong-link-between.util';

import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';

export class WWingTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.WWing;

    find(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const bivalueCells = context.getBlankCells().filter(cell => context.getCandidates(cell).length === 2);

        for (const [firstCell, secondCell] of getCombinations(bivalueCells, 2)) {
            const firstCandidates = context.getCandidates(firstCell);
            const secondCandidates = context.getCandidates(secondCell);

            if (hasSameCandidates(firstCandidates, secondCandidates) && !canSee(context, firstCell, secondCell)) {
                for (const strongValue of firstCandidates) {
                    const otherValue = firstCandidates.find(candidate => candidate !== strongValue);

                    if (isDefined(otherValue) && hasStrongLinkBetween(context, firstCell, secondCell, strongValue)) {
                        const eliminations = getCommonPeerEliminations(context, [firstCell, secondCell], otherValue, [
                            firstCell,
                            secondCell
                        ]);

                        results.push(...createEliminationResults(context, this.technique, eliminations, [firstCell, secondCell]));
                    }
                }
            }
        }

        return results;
    }
}
