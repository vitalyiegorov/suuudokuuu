import { AbstractNakedSubsetTechnique } from '../../@generic/classes/abstract-naked-subset-technique';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';

import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';

export class NakedPairTechnique extends AbstractNakedSubsetTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.NakedPair;
    protected readonly size = 2;
}
