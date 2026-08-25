import type { PuzzleCorpusType } from '../types/puzzle-corpus.type';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export interface DifficultyBandInterface {
    blankCells: number;
    corpus: PuzzleCorpusType | null;
    simplerLadderMaxTechnique: SolutionTechniqueEnum | null;
    bandLadderMaxTechnique: SolutionTechniqueEnum | null;
}
