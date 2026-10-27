import type { GameSetupInterface } from './game-setup.interface';
import type { FieldEngine, FieldSnapshotInterface } from '@suuudokuuu/field-core';
import type { CurrentRunType } from '@suuudokuuu/progress';
import type { ImportedPuzzleAssessmentKindEnum, ImportedPuzzleAssessmentType } from '@suuudokuuu/puzzle-forge';

export interface GameContextValueInterface {
    readonly create: (setup: GameSetupInterface) => void;
    readonly createDaily: (maxMistakes: number) => void;
    readonly createFromState: (newState: CurrentRunType) => void;
    readonly createFromImport: (
        sudokuString: string,
        assessment: Extract<ImportedPuzzleAssessmentType, { readonly kind: ImportedPuzzleAssessmentKindEnum.UNIQUE }>,
        maxMistakes: number
    ) => void;
    readonly engine: FieldEngine;
    readonly isCreatingGame: boolean;
    readonly snapshot: FieldSnapshotInterface;
}
