import { isDefined } from '@rnw-community/shared';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createEliminationResults } from '../../@generic/utils/create-elimination-results.util';
import { getCombinations } from '../../@generic/utils/get-combinations.util';
import { getCommonPeerEliminations } from '../../@generic/utils/get-common-peer-eliminations.util';
import { getUniqueValues } from '../../@generic/utils/get-unique-values.util';

import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';

export class XYZWingTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.XYZWing;

    find(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const pivot of context.getBlankCells().filter(cell => context.getCandidates(cell).length === 3)) {
            const pivotCandidates = context.getCandidates(pivot);
            const pincers = context
                .getPeers(pivot)
                .filter(cell => context.getCandidates(cell).length === 2)
                .filter(cell => context.getCandidates(cell).every(candidate => pivotCandidates.includes(candidate)));

            for (const [firstPincer, secondPincer] of getCombinations(pincers, 2)) {
                const pincerCandidates = getUniqueValues([...context.getCandidates(firstPincer), ...context.getCandidates(secondPincer)]);
                const sharedCandidates = context
                    .getCandidates(firstPincer)
                    .filter(candidate => context.getCandidates(secondPincer).includes(candidate));
                const [eliminationValue] = sharedCandidates;

                if (pincerCandidates.length === 3 && sharedCandidates.length === 1 && isDefined(eliminationValue)) {
                    const reasonCells = [pivot, firstPincer, secondPincer];
                    const eliminations = getCommonPeerEliminations(context, reasonCells, eliminationValue, reasonCells);

                    results.push(...createEliminationResults(this.technique, eliminations, reasonCells));
                }
            }
        }

        return results;
    }
}
