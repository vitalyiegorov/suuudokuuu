import type { StepScriptInterface } from '../../step-script/interfaces/step-script.interface';
import type { FieldCandidatesType } from '../types/field-candidates.type';
import type { FieldInputModeType } from '../types/field-input-mode.type';
import type { CellInterface, DifficultyEnum, FieldInterface } from '@suuudokuuu/generator';

export interface FieldSnapshotInterface {
    field: FieldInterface;
    difficulty: DifficultyEnum;
    sudokuString: string;
    selectedCell?: CellInterface;
    candidates: FieldCandidatesType;
    eliminatedCandidates: FieldCandidatesType;
    inputMode: FieldInputModeType;
    showAutoCandidates: boolean;
    mistakes: number;
    isWon: boolean;
    canUndo: boolean;
    canRedo: boolean;
    stepScript: StepScriptInterface | null;
    stepIndex: number;
}
