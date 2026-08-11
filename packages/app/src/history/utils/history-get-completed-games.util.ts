import type { CompletedGameInterface } from '../interfaces/completed-game.interface';
import type { HistoryGameInterface } from '../interfaces/history-game.interface';
import type { DifficultyEnum } from '@suuudokuuu/generator';

export const historyGetCompletedGames = (
    historyByDifficulty: Record<DifficultyEnum, HistoryGameInterface>
): readonly CompletedGameInterface[] => Object.values(historyByDifficulty).flatMap(history => history.completedGames);
