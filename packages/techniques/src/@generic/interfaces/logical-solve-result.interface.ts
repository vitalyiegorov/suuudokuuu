import type { SolutionTechniqueEnum } from '../enums/solution-technique.enum';

export interface LogicalSolveResultInterface {
    isSolved: boolean;
    requiredTechniques: SolutionTechniqueEnum[];
    hardestTechnique: SolutionTechniqueEnum;
}
