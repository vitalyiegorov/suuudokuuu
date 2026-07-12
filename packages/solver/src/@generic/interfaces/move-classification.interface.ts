import type { SolutionTechniqueEnum } from '../enums/solution-technique.enum';

export interface MoveClassificationInterface {
    technique: SolutionTechniqueEnum;
    value: number;
}
