import { isDefined } from '@rnw-community/shared';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createPlacementResult } from '../../@generic/utils/create-placement-result.util';

import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';

export class FullHouseTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.FullHouse;

    find(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const unit of context.getUnits()) {
            const blankCells = unit.cells.filter(cell => context.isBlankCell(cell));
            const [targetCell] = blankCells;

            if (blankCells.length === 1 && isDefined(targetCell)) {
                const candidates = context.getCandidates(targetCell);
                const [value] = candidates;

                if (candidates.length === 1 && isDefined(value)) {
                    results.push(createPlacementResult(this.technique, targetCell, value, unit.cells));
                }
            }
        }

        return results;
    }
}
