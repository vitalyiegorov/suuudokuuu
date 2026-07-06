import type { SolutionTechniqueEnum } from '../enums/solution-technique.enum';

export interface TechniqueEliminationExpectationInterface {
    technique: SolutionTechniqueEnum;
    rowIndex: number;
    columnIndex: number;
    value: number;
}
