import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { AbstractPointingTechnique } from '../abstract-pointing-technique';

import type { TechniqueStrategyInterface } from '../../../interfaces/technique-strategy.interface';

export class PointingPairTechnique extends AbstractPointingTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.PointingPair;
    protected readonly size = 2;
}
