import { AbstractNakedSubsetTechnique } from '../../@generic/classes/abstract-naked-subset-technique';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';

import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';

export class NakedQuadTechnique extends AbstractNakedSubsetTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.NakedQuad;
    protected readonly size = 4;
}
