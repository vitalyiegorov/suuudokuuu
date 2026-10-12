import type { SolutionTechniqueEnum } from '../enums/solution-technique.enum';

export interface SizedTechniqueDescriptorInterface {
    readonly technique: SolutionTechniqueEnum;
    readonly size: number;
}
