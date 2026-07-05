import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { AbstractPointingTechnique } from '../abstract-pointing-technique';

import type { TechniqueStrategyInterface } from '../../../interfaces/technique-strategy.interface';

export class PointingTripleTechnique extends AbstractPointingTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.PointingTriple;
    protected readonly size = 3;
}
