import { isDefined } from '@rnw-community/shared';

import { AbstractWingTechnique } from '../../@generic/classes/abstract-wing-technique';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';

import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';

export class WWingTechnique extends AbstractWingTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.WWing;

    find(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const bivalueCells = context.getBlankCells().filter(cell => context.getCandidates(cell).length === 2);

        for (const [firstCell, secondCell] of this.getCombinations(bivalueCells, 2)) {
            const firstCandidates = context.getCandidates(firstCell);
            const secondCandidates = context.getCandidates(secondCell);

            if (this.hasSameCandidates(firstCandidates, secondCandidates) && !this.canSee(context, firstCell, secondCell)) {
                for (const strongValue of firstCandidates) {
                    const otherValue = firstCandidates.find(candidate => candidate !== strongValue);

                    if (isDefined(otherValue) && this.hasStrongLinkBetween(context, firstCell, secondCell, strongValue)) {
                        const eliminations = this.getCommonPeerEliminations(context, [firstCell, secondCell], otherValue, [
                            firstCell,
                            secondCell
                        ]);

                        results.push(...this.createEliminationResults(context, this.technique, eliminations, [firstCell, secondCell]));
                    }
                }
            }
        }

        return results;
    }
}
