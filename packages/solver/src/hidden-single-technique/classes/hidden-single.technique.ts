import { isDefined } from '@rnw-community/shared';

import { AbstractTechnique } from '../../@generic/classes/abstract-technique';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';

import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';

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
