import { describe, expect, it } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { emptyGameHistory } from '../interfaces/history-game.interface';

import { historyGetCompletedGames } from './history-get-completed-games.util';

import type { CompletedGameInterface } from '../interfaces/completed-game.interface';
import type { HistoryGameInterface } from '../interfaces/history-game.interface';

const buildCompletedGame = (difficulty: DifficultyEnum, completedAt: number): CompletedGameInterface => ({
    completedAt,
    difficulty,
    rating: 0,
    isRatingCeiling: false,
    elapsedTime: 100,
    encodedState: '',
    maxMistakes: 3,
    mistakes: 0,
    score: 500
});

const buildHistoryByDifficulty = (
    overridesByDifficulty: Partial<Record<DifficultyEnum, Partial<HistoryGameInterface>>>
): Record<DifficultyEnum, HistoryGameInterface> => ({
    [DifficultyEnum.Newbie]: { ...emptyGameHistory, difficulty: DifficultyEnum.Newbie, ...overridesByDifficulty[DifficultyEnum.Newbie] },
    [DifficultyEnum.Easy]: { ...emptyGameHistory, difficulty: DifficultyEnum.Easy, ...overridesByDifficulty[DifficultyEnum.Easy] },
    [DifficultyEnum.Medium]: { ...emptyGameHistory, difficulty: DifficultyEnum.Medium, ...overridesByDifficulty[DifficultyEnum.Medium] },
    [DifficultyEnum.Hard]: { ...emptyGameHistory, difficulty: DifficultyEnum.Hard, ...overridesByDifficulty[DifficultyEnum.Hard] },
    [DifficultyEnum.Nightmare]: {
        ...emptyGameHistory,
        difficulty: DifficultyEnum.Nightmare,
        ...overridesByDifficulty[DifficultyEnum.Nightmare]
    },
    [DifficultyEnum.Hell]: { ...emptyGameHistory, difficulty: DifficultyEnum.Hell, ...overridesByDifficulty[DifficultyEnum.Hell] },
    [DifficultyEnum.Infinity]: {
        ...emptyGameHistory,
        difficulty: DifficultyEnum.Infinity,
        ...overridesByDifficulty[DifficultyEnum.Infinity]
    }
});

describe('historyGetCompletedGames', () => {
    it('should return an empty array when no difficulty has completed games', () => {
        expect.assertions(1);

        expect(historyGetCompletedGames(buildHistoryByDifficulty({}))).toStrictEqual([]);
    });

    it('should flatten completed games across every difficulty', () => {
        expect.assertions(1);

        const easyGame = buildCompletedGame(DifficultyEnum.Easy, 1);
        const hardGame = buildCompletedGame(DifficultyEnum.Hard, 2);
        const historyByDifficulty = buildHistoryByDifficulty({
            [DifficultyEnum.Easy]: { completedGames: [easyGame] },
            [DifficultyEnum.Hard]: { completedGames: [hardGame] }
        });

        expect(historyGetCompletedGames(historyByDifficulty)).toStrictEqual([easyGame, hardGame]);
    });
});
