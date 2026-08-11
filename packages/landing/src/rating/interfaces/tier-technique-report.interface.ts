import type { TechniqueUsageInterface } from './technique-usage.interface';
import type { DifficultyEnum } from '@suuudokuuu/generator';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export interface TierTechniqueReportInterface {
    difficulty: DifficultyEnum;
    clueCount: number;
    sampleSize: number;
    singlesOnlyPuzzleCount: number;
    beyondLadderPuzzleCount: number;
    typicalHardestTechnique: SolutionTechniqueEnum;
    hardestTechniqueReached: SolutionTechniqueEnum;
    techniqueUsages: TechniqueUsageInterface[];
}
