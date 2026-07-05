import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { AbstractNakedSubsetTechnique } from '../abstract-naked-subset-technique';

import type { TechniqueStrategyInterface } from '../../../interfaces/technique-strategy.interface';

export class NakedTripleTechnique extends AbstractNakedSubsetTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.NakedTriple;
    protected readonly size = 3;
}
