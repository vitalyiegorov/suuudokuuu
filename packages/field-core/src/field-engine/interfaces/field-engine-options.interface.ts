import type { FieldHistoryEntryInterface } from './field-history-entry.interface';
import type { FieldCandidatesType } from '../types/field-candidates.type';
import type { FieldInputModeType } from '../types/field-input-mode.type';
import type { DifficultyEnum, SudokuConfigInterface } from '@suuudokuuu/generator';

export interface FieldEngineOptionsInterface {
    sudokuString: string;
    difficulty: DifficultyEnum;
    config?: SudokuConfigInterface;
    candidates?: FieldCandidatesType;
    eliminatedCandidates?: FieldCandidatesType;
    inputMode?: FieldInputModeType;
    showAutoCandidates?: boolean;
    mistakes?: number;
    history?: FieldHistoryEntryInterface[];
    historyIndex?: number;
}
