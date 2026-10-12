import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export interface PuzzleRatingInterface {
    readonly rating: number;
    readonly hardestTechnique: SolutionTechniqueEnum;
    readonly isCeiling: boolean;
}
