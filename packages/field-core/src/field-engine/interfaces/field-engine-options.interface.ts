import type { FieldCandidatesType } from '../types/field-candidates.type';
import type { FieldInputModeType } from '../types/field-input-mode.type';
import type { DifficultyEnum } from '@suuudokuuu/generator';

export interface FieldEngineOptionsInterface {
    sudokuString: string;
    difficulty: DifficultyEnum;
    candidates?: FieldCandidatesType;
    eliminatedCandidates?: FieldCandidatesType;
    inputMode?: FieldInputModeType;
    showAutoCandidates?: boolean;
    mistakes?: number;
}
