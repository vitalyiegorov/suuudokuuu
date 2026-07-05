import { isDefined } from '@rnw-community/shared';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { AbstractTechnique } from '../abstract-technique';

import type { TechniqueResultInterface } from '../../../interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../../interfaces/technique-strategy.interface';
import type { CandidateContext } from '../candidate-context/candidate-context';

export class HiddenSingleTechnique extends AbstractTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.HiddenSingle;

    find(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const unit of context.getUnits()) {
            for (const value of context.getValues()) {
                const cellsWithCandidate = unit.cells.filter(cell => context.getCandidates(cell).includes(value));
                const [targetCell] = cellsWithCandidate;

                if (cellsWithCandidate.length === 1 && isDefined(targetCell) && context.getCandidates(targetCell).length > 1) {
                    results.push(this.createPlacement(this.technique, targetCell, value, unit.cells));
                }
            }
        }

        return results;
    }
}
