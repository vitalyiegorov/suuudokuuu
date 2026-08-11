import type { TechniqueUsageInterface } from './technique-usage.interface';
import type { LandingDifficultyType } from '../../difficulty/types/landing-difficulty.type';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export interface TierTechniqueReportInterface {
    difficulty: LandingDifficultyType;
    clueCount: number;
    sampleSize: number;
    singlesOnlyPuzzleCount: number;
    beyondLadderPuzzleCount: number;
    typicalHardestTechnique: SolutionTechniqueEnum;
    hardestTechniqueReached: SolutionTechniqueEnum;
    techniqueUsages: TechniqueUsageInterface[];
}
