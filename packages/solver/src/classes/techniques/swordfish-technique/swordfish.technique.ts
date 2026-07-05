import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { AbstractBasicFishTechnique } from '../abstract-basic-fish-technique';

import type { TechniqueStrategyInterface } from '../../../interfaces/technique-strategy.interface';

export class SwordfishTechnique extends AbstractBasicFishTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.Swordfish;
    protected readonly size = 3;
}
