import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export interface DifficultyBandInterface {
    blankCells: number;
    isCorpusSourced: boolean;
    simplerLadderMaxTechnique: SolutionTechniqueEnum | null;
    bandLadderMaxTechnique: SolutionTechniqueEnum | null;
}
