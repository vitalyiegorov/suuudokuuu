import { isDefined } from '@rnw-community/shared';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { AbstractWingTechnique } from '../abstract-wing-technique';

import type { TechniqueResultInterface } from '../../../interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../../interfaces/technique-strategy.interface';
import type { CandidateContext } from '../candidate-context/candidate-context';
import type { CellInterface } from '@suuudokuuu/generator';

export class XYWingTechnique extends AbstractWingTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.XYWing;

    find(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const pivot of context.getBlankCells().filter(cell => context.getCandidates(cell).length === 2)) {
            const pincers = context.getPeers(pivot).filter(cell => context.getCandidates(cell).length === 2);

            for (const [firstPincer, secondPincer] of this.getCombinations(pincers, 2)) {
                const eliminationValue = this.getEliminationValue(context, pivot, firstPincer, secondPincer);

                if (isDefined(eliminationValue)) {
                    const reasonCells = [pivot, firstPincer, secondPincer];
                    const eliminations = this.getCommonPeerEliminations(
                        context,
                        [firstPincer, secondPincer],
                        eliminationValue,
                        reasonCells
                    );

                    results.push(...this.createEliminationResults(context, this.technique, eliminations, reasonCells));
                }
            }
        }

        return results;
    }

    private getEliminationValue(
        context: CandidateContext,
        pivot: CellInterface,
        firstPincer: CellInterface,
        secondPincer: CellInterface
    ): number | null {
        const pivotCandidates = context.getCandidates(pivot);
        const firstCandidates = context.getCandidates(firstPincer);
        const secondCandidates = context.getCandidates(secondPincer);
        const sharedByPincers = firstCandidates.filter(candidate => secondCandidates.includes(candidate));
        const eliminationValue = sharedByPincers.find(candidate => !pivotCandidates.includes(candidate));
        const firstPivotValues = firstCandidates.filter(candidate => pivotCandidates.includes(candidate));
        const secondPivotValues = secondCandidates.filter(candidate => pivotCandidates.includes(candidate));

        if (
            firstPivotValues.length === 1 &&
            secondPivotValues.length === 1 &&
            firstPivotValues[0] !== secondPivotValues[0] &&
            isDefined(eliminationValue)
        ) {
            return eliminationValue;
        }

        return null;
    }
}
