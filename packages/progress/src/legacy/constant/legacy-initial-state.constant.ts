import { DifficultyEnum } from '@suuudokuuu/generator';

import { initialCurrentRun } from '../../current-run/constant/initial-current-run.constant';

import type {
    LegacyGameStateInterface,
    LegacyHistoryInterface,
    LegacyRatingSnapshotInterface
} from '../interface/legacy-root-state.interface';

export const emptyLegacyRatingSnapshot: LegacyRatingSnapshotInterface = { rating: 0, isRatingCeiling: false };

export const emptyLegacyHistory: LegacyHistoryInterface = {
    bestScore: 0,
    bestRating: emptyLegacyRatingSnapshot,
    bestTime: 0,
    difficulty: DifficultyEnum.Easy,
    gamesCompleted: 0,
    gamesLost: 0,
    gamesWon: 0,
    gamesWonWithoutMistakes: 0,
    averageTime: 0,
    hardcoreWon: 0,
    challengesWon: 0,
    challengesLost: 0,
    completedGames: []
};

export const legacyInitialGameState: LegacyGameStateInterface = {
    ...initialCurrentRun,
    historyByDifficulty: {
        [DifficultyEnum.Newbie]: { ...emptyLegacyHistory, difficulty: DifficultyEnum.Newbie },
        [DifficultyEnum.Easy]: { ...emptyLegacyHistory, difficulty: DifficultyEnum.Easy },
        [DifficultyEnum.Medium]: { ...emptyLegacyHistory, difficulty: DifficultyEnum.Medium },
        [DifficultyEnum.Hard]: { ...emptyLegacyHistory, difficulty: DifficultyEnum.Hard },
        [DifficultyEnum.Nightmare]: { ...emptyLegacyHistory, difficulty: DifficultyEnum.Nightmare },
        [DifficultyEnum.Hell]: { ...emptyLegacyHistory, difficulty: DifficultyEnum.Hell },
        [DifficultyEnum.Infinity]: { ...emptyLegacyHistory, difficulty: DifficultyEnum.Infinity }
    },
    techniqueUsageCounts: {},
    playedDayNumbers: [],
    dailyCompletedDayNumbers: [],
    dailyBestStreak: 0
};
