import { AbstractPointingTechnique } from '../../@generic/classes/abstract-pointing-technique';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';

import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';

export class PointingTripleTechnique extends AbstractPointingTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.PointingTriple;
    protected readonly size = 3;
}
