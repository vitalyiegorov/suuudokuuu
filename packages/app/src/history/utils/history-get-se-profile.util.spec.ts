import { describe, expect, it } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { emptyGameHistory } from '../interfaces/history-game.interface';
import { emptyHistoryRatingSnapshot } from '../interfaces/history-rating-snapshot.interface';

import { historyGetSeProfile } from './history-get-se-profile.util';

import type { CompletedGameInterface } from '../interfaces/completed-game.interface';
import type { HistoryGameInterface } from '../interfaces/history-game.interface';

const hellHardestSolveRating = 8.5;

const buildCompletedGame = (overrides: Partial<CompletedGameInterface>): CompletedGameInterface => ({
    completedAt: 0,
    difficulty: DifficultyEnum.Newbie,
    elapsedTime: 0,
    encodedState: '',
    isRatingCeiling: false,
    maxMistakes: 3,
    mistakes: 0,
    rating: 0,
    score: 0,
    ...overrides
});

describe('historyGetSeProfile', () => {
    it('reports the hardest solve, average recent SE, and most-played difficulty', () => {
        const newbieCompletedGames = [
            buildCompletedGame({ completedAt: 1, difficulty: DifficultyEnum.Newbie, rating: 2 }),
            buildCompletedGame({ completedAt: 2, difficulty: DifficultyEnum.Newbie, rating: 0 })
        ];
        const hellCompletedGames = [
            buildCompletedGame({ completedAt: 3, difficulty: DifficultyEnum.Hell, rating: hellHardestSolveRating, isRatingCeiling: true })
        ];
        const historyByDifficulty: Record<DifficultyEnum, HistoryGameInterface> = {
            [DifficultyEnum.Newbie]: {
                ...emptyGameHistory,
                bestRating: emptyHistoryRatingSnapshot,
                completedGames: newbieCompletedGames,
                difficulty: DifficultyEnum.Newbie,
                gamesCompleted: 2
            },
            [DifficultyEnum.Easy]: { ...emptyGameHistory, difficulty: DifficultyEnum.Easy },
            [DifficultyEnum.Medium]: { ...emptyGameHistory, difficulty: DifficultyEnum.Medium },
            [DifficultyEnum.Hard]: { ...emptyGameHistory, difficulty: DifficultyEnum.Hard },
            [DifficultyEnum.Nightmare]: { ...emptyGameHistory, difficulty: DifficultyEnum.Nightmare },
            [DifficultyEnum.Hell]: {
                ...emptyGameHistory,
                bestRating: { isRatingCeiling: true, rating: hellHardestSolveRating },
                completedGames: hellCompletedGames,
                difficulty: DifficultyEnum.Hell,
                gamesCompleted: 5
            },
            [DifficultyEnum.Infinity]: { ...emptyGameHistory, difficulty: DifficultyEnum.Infinity }
        };
        const completedGames = [...newbieCompletedGames, ...hellCompletedGames];

        const profile = historyGetSeProfile(historyByDifficulty, completedGames);

        expect(profile.hardestSolveRating).toBe(hellHardestSolveRating);
        expect(profile.hardestSolveIsCeiling).toBe(true);
        expect(profile.averageRecentSeRating).toBe((2 + hellHardestSolveRating) / 2);
        expect(profile.mostPlayedDifficulty).toBe(DifficultyEnum.Hell);
        expect(profile.mostPlayedGamesCompleted).toBe(5);
    });

    it('returns empty defaults when nothing has been completed', () => {
        const historyByDifficulty: Record<DifficultyEnum, HistoryGameInterface> = {
            [DifficultyEnum.Newbie]: { ...emptyGameHistory },
            [DifficultyEnum.Easy]: { ...emptyGameHistory, difficulty: DifficultyEnum.Easy },
            [DifficultyEnum.Medium]: { ...emptyGameHistory, difficulty: DifficultyEnum.Medium },
            [DifficultyEnum.Hard]: { ...emptyGameHistory, difficulty: DifficultyEnum.Hard },
            [DifficultyEnum.Nightmare]: { ...emptyGameHistory, difficulty: DifficultyEnum.Nightmare },
            [DifficultyEnum.Hell]: { ...emptyGameHistory, difficulty: DifficultyEnum.Hell },
            [DifficultyEnum.Infinity]: { ...emptyGameHistory, difficulty: DifficultyEnum.Infinity }
        };

        const profile = historyGetSeProfile(historyByDifficulty, []);

        expect(profile.hardestSolveRating).toBe(0);
        expect(profile.averageRecentSeRating).toBe(0);
        expect(profile.mostPlayedDifficulty).toBeNull();
        expect(profile.mostPlayedGamesCompleted).toBe(0);
    });
});
