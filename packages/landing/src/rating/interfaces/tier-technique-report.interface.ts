import type { RatedDifficultyType } from '../../difficulty/types/rated-difficulty.type';
import type { TechniqueUsageInterface } from './technique-usage.interface';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export interface TierTechniqueReportInterface {
    difficulty: RatedDifficultyType;
    clueCount: number;
    highestClueCount: number;
    simplerLadderMaxTechnique: SolutionTechniqueEnum | null;
    bandLadderMaxTechnique: SolutionTechniqueEnum | null;
    sampleSize: number;
    singlesOnlyPuzzleCount: number;
    beyondLadderPuzzleCount: number;
    typicalHardestTechnique: SolutionTechniqueEnum;
    hardestTechniqueReached: SolutionTechniqueEnum;
    lowestRating: number;
    highestRating: number;
    ceilingRatedPuzzleCount: number;
    techniqueUsages: TechniqueUsageInterface[];
}
