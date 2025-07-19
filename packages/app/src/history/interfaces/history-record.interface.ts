import type { DifficultyEnum } from '@suuudokuuu/generator';

export interface HistoryRecordInterface {
    isWon: boolean;
    difficulty: DifficultyEnum;
}
