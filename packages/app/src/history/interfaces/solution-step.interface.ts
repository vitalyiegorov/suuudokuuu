import type { SolutionTechniqueEnum } from '../enums/solution-technique.enum';

export interface SolutionStepInterface {
    cellIndex: number;
    value: number;
    ts: number;
    technique: SolutionTechniqueEnum;
}
