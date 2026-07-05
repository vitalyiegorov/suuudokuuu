import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { AbstractBasicFishTechnique } from '../abstract-basic-fish-technique';

import type { TechniqueStrategyInterface } from '../../../interfaces/technique-strategy.interface';

export class XWingTechnique extends AbstractBasicFishTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.XWing;
    protected readonly size = 2;
}
