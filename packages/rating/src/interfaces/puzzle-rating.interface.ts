import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export interface PuzzleRatingInterface {
    rating: number;
    hardestTechnique: SolutionTechniqueEnum;
    isCeiling: boolean;
}
