import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { AbstractNakedSubsetTechnique } from '../abstract-naked-subset-technique';

import type { TechniqueStrategyInterface } from '../../../interfaces/technique-strategy.interface';

export class NakedQuadTechnique extends AbstractNakedSubsetTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.NakedQuad;
    protected readonly size = 4;
}
