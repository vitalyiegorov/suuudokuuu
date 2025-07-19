import { DifficultyEnum } from '@suuudokuuu/generator';

import { type HistoryGameInterface, emptyGameHistory } from '../interfaces/history-game.interface';

// ts-prune-ignore-next
export interface HistoryState {
    byDifficulty: Record<DifficultyEnum, HistoryGameInterface>;
}

export const initialHistoryState: HistoryState = {
    byDifficulty: {
        [DifficultyEnum.Newbie]: emptyGameHistory,
        [DifficultyEnum.Easy]: emptyGameHistory,
        [DifficultyEnum.Medium]: emptyGameHistory,
        [DifficultyEnum.Hard]: emptyGameHistory,
        [DifficultyEnum.Nightmare]: emptyGameHistory
    }
};
