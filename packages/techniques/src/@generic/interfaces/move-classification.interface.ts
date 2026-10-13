import type { SolutionTechniqueEnum } from '../enums/solution-technique.enum';

export interface MoveClassificationInterface {
    readonly technique: SolutionTechniqueEnum;
    readonly value: number;
}
