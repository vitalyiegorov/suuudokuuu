import type { ImportedPuzzleAssessmentKindEnum } from '../enums/imported-puzzle-assessment-kind.enum';
import type { DifficultyEnum } from '@suuudokuuu/generator';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export type ImportedPuzzleAssessmentType =
    | { readonly kind: ImportedPuzzleAssessmentKindEnum.CONFLICT; readonly cellIndexes: readonly number[] }
    | { readonly kind: ImportedPuzzleAssessmentKindEnum.NO_SOLUTION | ImportedPuzzleAssessmentKindEnum.MULTIPLE_SOLUTIONS }
    | {
          readonly kind: ImportedPuzzleAssessmentKindEnum.UNIQUE;
          readonly solutionString: string;
          readonly rating: number;
          readonly isRatingCeiling: boolean;
          readonly hardestTechnique: SolutionTechniqueEnum;
          readonly difficulty: DifficultyEnum;
      };
