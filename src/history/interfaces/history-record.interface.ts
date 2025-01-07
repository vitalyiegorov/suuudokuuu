import type { DifficultyEnum } from '../../@generic/enums/difficulty.enum';

export interface HistoryRecordInterface {
    isWon: boolean;
    difficulty: DifficultyEnum;
}
