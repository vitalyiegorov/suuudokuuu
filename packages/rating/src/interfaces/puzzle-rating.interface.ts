import type { CeilingReasonType } from '../types/ceiling-reason.type';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export interface PuzzleRatingInterface {
    rating: number;
    hardestTechnique: SolutionTechniqueEnum;
    isCeiling: boolean;
    ceilingReason?: CeilingReasonType;
}
