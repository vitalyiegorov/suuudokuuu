import type { CompletedGameType } from '../../completed-game/type/completed-game.type';
import type { CurrentRunType } from '../../current-run/type/current-run.type';
import type { CustomThemeType } from '../../custom-theme/type/custom-theme.type';
import type { PlayerStatsType } from '../../player-stats/type/player-stats.type';
import type { SettingsType } from '../../settings/type/settings.type';
import type { DifficultyEnum } from '@suuudokuuu/generator';

export interface LegacyRatingSnapshotInterface {
    rating: number;
    isRatingCeiling: boolean;
}

export interface LegacyHistoryInterface {
    difficulty: DifficultyEnum;
    gamesCompleted: number;
    gamesWon: number;
    gamesWonWithoutMistakes: number;
    gamesLost: number;
    bestScore: number;
    bestRating: LegacyRatingSnapshotInterface;
    bestTime: number;
    averageTime: number;
    hardcoreWon: number;
    challengesWon: number;
    challengesLost: number;
    completedGames: Omit<CompletedGameType, 'dailyDayNumber'>[];
}

export interface LegacyGameStateInterface extends CurrentRunType {
    historyByDifficulty: Record<DifficultyEnum, LegacyHistoryInterface>;
    techniqueUsageCounts: PlayerStatsType['techniqueUsageCounts'];
    playedDayNumbers: readonly number[];
    dailyCompletedDayNumbers: readonly number[];
    dailyBestStreak: number;
}

export interface LegacyRootStateInterface {
    game: LegacyGameStateInterface;
    settings: SettingsType;
    customThemes: { readonly themes: readonly CustomThemeType[] };
}
