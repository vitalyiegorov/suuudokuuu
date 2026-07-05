import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { AbstractHiddenSubsetTechnique } from '../abstract-hidden-subset-technique';

import type { TechniqueStrategyInterface } from '../../../interfaces/technique-strategy.interface';

export class HiddenQuadTechnique extends AbstractHiddenSubsetTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.HiddenQuad;
    protected readonly size = 4;
}
