import { isDefined } from '@rnw-community/shared';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createEliminationResults } from '../../@generic/utils/create-elimination-results.util';
import { getBivalueCells } from '../../@generic/utils/get-bivalue-cells.util';
import { getCombinations } from '../../@generic/utils/get-combinations.util';
import { getCommonPeerEliminations } from '../../@generic/utils/get-common-peer-eliminations.util';
import { isBivalueCell } from '../../@generic/utils/is-bivalue-cell.util';

import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export class XYWingTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.XYWing;

    find(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const pivot of getBivalueCells(context)) {
            const pincers = context.getPeers(pivot).filter(cell => isBivalueCell(context, cell));

            for (const [firstPincer, secondPincer] of getCombinations(pincers, 2)) {
                const eliminationValue = this.getEliminationValue(context, pivot, firstPincer, secondPincer);

                if (isDefined(eliminationValue)) {
                    const reasonCells = [pivot, firstPincer, secondPincer];
                    const eliminations = getCommonPeerEliminations(context, [firstPincer, secondPincer], eliminationValue, reasonCells);

                    results.push(...createEliminationResults(this.technique, eliminations, reasonCells));
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
