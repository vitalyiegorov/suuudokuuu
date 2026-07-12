import type { CompletedGameInterface } from '../interfaces/completed-game.interface';
import type { HistoryGameInterface } from '../interfaces/history-game.interface';
import type { DifficultyEnum } from '@suuudokuuu/generator';

export const historyGetCompletedGames = (
    historyByDifficulty: Record<DifficultyEnum, HistoryGameInterface>,
    difficulties: readonly DifficultyEnum[]
): CompletedGameInterface[] =>
    difficulties
        .flatMap(difficulty => historyByDifficulty[difficulty].completedGames)
        .sort((previousGame, nextGame) => nextGame.completedAt - previousGame.completedAt);
