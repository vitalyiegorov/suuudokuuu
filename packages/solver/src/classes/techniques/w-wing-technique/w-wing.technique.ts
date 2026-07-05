import { isDefined } from '@rnw-community/shared';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { AbstractWingTechnique } from '../abstract-wing-technique';

import type { TechniqueResultInterface } from '../../../interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../../interfaces/technique-strategy.interface';
import type { CandidateContext } from '../candidate-context/candidate-context';

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
