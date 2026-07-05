import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { AbstractBasicFishTechnique } from '../abstract-basic-fish-technique';

import type { TechniqueStrategyInterface } from '../../../interfaces/technique-strategy.interface';

export class JellyfishTechnique extends AbstractBasicFishTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.Jellyfish;
    protected readonly size = 4;
}
