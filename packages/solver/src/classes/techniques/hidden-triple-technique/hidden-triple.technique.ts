import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { AbstractHiddenSubsetTechnique } from '../abstract-hidden-subset-technique';

import type { TechniqueStrategyInterface } from '../../../interfaces/technique-strategy.interface';

export class HiddenTripleTechnique extends AbstractHiddenSubsetTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.HiddenTriple;
    protected readonly size = 3;
}
