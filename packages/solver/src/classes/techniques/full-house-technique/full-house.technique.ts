import { isDefined } from '@rnw-community/shared';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { AbstractTechnique } from '../abstract-technique';

import type { TechniqueResultInterface } from '../../../interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../../interfaces/technique-strategy.interface';
import type { CandidateContext } from '../candidate-context/candidate-context';

export class FullHouseTechnique extends AbstractTechnique implements TechniqueStrategyInterface {
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
                    results.push(this.createPlacement(this.technique, targetCell, value, unit.cells));
                }
            }
        }

        return results;
    }
}
