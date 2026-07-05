import { AbstractBasicFishTechnique } from '../../@generic/classes/abstract-basic-fish-technique';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';

import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';

export class JellyfishTechnique extends AbstractBasicFishTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.Jellyfish;
    protected readonly size = 4;
}
