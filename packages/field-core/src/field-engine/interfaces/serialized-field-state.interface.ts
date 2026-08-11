import type { FieldHistoryEntryInterface } from './field-history-entry.interface';
import type { FieldCandidatesType } from '../types/field-candidates.type';
import type { FieldInputModeType } from '../types/field-input-mode.type';
import type { DifficultyEnum } from '@suuudokuuu/generator';

export interface SerializedFieldStateInterface {
    sudokuString: string;
    difficulty: DifficultyEnum;
    candidates: FieldCandidatesType;
    inputMode: FieldInputModeType;
    showAutoCandidates: boolean;
    mistakes: number;
    history: FieldHistoryEntryInterface[];
    historyIndex: number;
}
