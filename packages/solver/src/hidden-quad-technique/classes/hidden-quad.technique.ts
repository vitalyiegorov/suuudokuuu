import { AbstractHiddenSubsetTechnique } from '../../@generic/classes/abstract-hidden-subset-technique';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';

import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';

export class HiddenQuadTechnique extends AbstractHiddenSubsetTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.HiddenQuad;
    protected readonly size = 4;
}
