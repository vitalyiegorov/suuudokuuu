import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export interface TechniqueUsageInterface {
    readonly technique: SolutionTechniqueEnum;
    readonly count: number;
    readonly seValue: number;
}
