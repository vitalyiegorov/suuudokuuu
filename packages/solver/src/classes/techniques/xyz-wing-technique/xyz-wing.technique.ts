import { isDefined } from '@rnw-community/shared';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { AbstractWingTechnique } from '../abstract-wing-technique';

import type { TechniqueResultInterface } from '../../../interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../../interfaces/technique-strategy.interface';
import type { CandidateContext } from '../candidate-context/candidate-context';

export class XYZWingTechnique extends AbstractWingTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.XYZWing;

    find(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const pivot of context.getBlankCells().filter(cell => context.getCandidates(cell).length === 3)) {
            const pivotCandidates = context.getCandidates(pivot);
            const pincers = context
                .getPeers(pivot)
                .filter(cell => context.getCandidates(cell).length === 2)
                .filter(cell => context.getCandidates(cell).every(candidate => pivotCandidates.includes(candidate)));

            for (const [firstPincer, secondPincer] of this.getCombinations(pincers, 2)) {
                const pincerCandidates = this.getUniqueValues([
                    ...context.getCandidates(firstPincer),
                    ...context.getCandidates(secondPincer)
                ]);
                const sharedCandidates = context
                    .getCandidates(firstPincer)
                    .filter(candidate => context.getCandidates(secondPincer).includes(candidate));
                const [eliminationValue] = sharedCandidates;

                if (pincerCandidates.length === 3 && sharedCandidates.length === 1 && isDefined(eliminationValue)) {
                    const reasonCells = [pivot, firstPincer, secondPincer];
                    const eliminations = this.getCommonPeerEliminations(context, reasonCells, eliminationValue, reasonCells);

                    results.push(...this.createEliminationResults(context, this.technique, eliminations, reasonCells));
                }
            }
        }

        return results;
    }
}
