import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { AbstractNakedSubsetTechnique } from '../abstract-naked-subset-technique';

import type { TechniqueStrategyInterface } from '../../../interfaces/technique-strategy.interface';

export class NakedPairTechnique extends AbstractNakedSubsetTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.NakedPair;
    protected readonly size = 2;
}
