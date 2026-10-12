import type { PuzzleCorpusEnum } from '../enums/puzzle-corpus.enum';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export interface DifficultyBandInterface {
    readonly blankCells: number;
    readonly corpus: PuzzleCorpusEnum | null;
    readonly simplerLadderMaxTechnique: SolutionTechniqueEnum | null;
    readonly bandLadderMaxTechnique: SolutionTechniqueEnum | null;
}
