import { isDefined } from '@rnw-community/shared';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { canSee } from '../../@generic/utils/can-see.util';
import { getContextUnitValueIndex } from '../../@generic/utils/context-scan-state.util';
import { createEliminationResults } from '../../@generic/utils/create-elimination-results.util';
import { getBivalueCells } from '../../@generic/utils/get-bivalue-cells.util';
import { getCombinations } from '../../@generic/utils/get-combinations.util';
import { getCommonPeerEliminations } from '../../@generic/utils/get-common-peer-eliminations.util';
import { getUniqueCells } from '../../@generic/utils/get-unique-cells.util';
import { hasSameCandidates } from '../../@generic/utils/has-same-candidates.util';

import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export class WWingTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.WWing;

    find(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const bivalueCells = getBivalueCells(context);

        for (const [firstCell, secondCell] of getCombinations(bivalueCells, 2)) {
            const firstCandidates = context.getCandidates(firstCell);
            const secondCandidates = context.getCandidates(secondCell);

            if (hasSameCandidates(firstCandidates, secondCandidates) && !canSee(firstCell, secondCell)) {
                for (const strongValue of firstCandidates) {
                    const otherValue = firstCandidates.find(candidate => candidate !== strongValue);
                    const linkCells = this.getStrongLinkCells(context, firstCell, secondCell, strongValue);

                    if (isDefined(otherValue) && isDefined(linkCells)) {
                        const eliminations = getCommonPeerEliminations(context, [firstCell, secondCell], otherValue, [
                            firstCell,
                            secondCell
                        ]);

                        results.push(
                            ...createEliminationResults(this.technique, eliminations, getUniqueCells([firstCell, secondCell, ...linkCells]))
                        );
                    }
                }
            }
        }

        return results;
    }

    private getStrongLinkCells(
        context: CandidateContext,
        firstCell: CellInterface,
        secondCell: CellInterface,
        value: number
    ): readonly CellInterface[] | null {
        const index = getContextUnitValueIndex(context);

        for (let unitPosition = 0; unitPosition < index.units.length; unitPosition += 1) {
            const { cells } = index.getUnitValueEntry(unitPosition, value);
            const [firstLinkCell, secondLinkCell] = cells;

            if (cells.length === 2 && isDefined(firstLinkCell) && isDefined(secondLinkCell)) {
                const seesForwardLink = canSee(firstCell, firstLinkCell) && canSee(secondCell, secondLinkCell);
                const seesReverseLink = canSee(firstCell, secondLinkCell) && canSee(secondCell, firstLinkCell);

                if (seesForwardLink || seesReverseLink) {
                    return cells;
                }
            }
        }

        return null;
    }
}
