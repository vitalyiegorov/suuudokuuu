import type { CompletedGameType } from '../../completed-game/type/completed-game.type';
import type { CurrentRunType } from '../../current-run/type/current-run.type';
import type { CustomThemeType } from '../../custom-theme/type/custom-theme.type';
import type { PlayerStatsType } from '../../player-stats/type/player-stats.type';
import type { SettingsType } from '../../settings/type/settings.type';
import type { DifficultyEnum } from '@suuudokuuu/generator';

export interface LegacyRatingSnapshotInterface {
    readonly rating: number;
    readonly isRatingCeiling: boolean;
}

export interface LegacyHistoryInterface {
    readonly difficulty: DifficultyEnum;
    readonly gamesCompleted: number;
    readonly gamesWon: number;
    readonly gamesWonWithoutMistakes: number;
    readonly gamesLost: number;
    readonly bestScore: number;
    readonly bestRating: LegacyRatingSnapshotInterface;
    readonly bestTime: number;
    readonly averageTime: number;
    readonly hardcoreWon: number;
    readonly challengesWon: number;
    readonly challengesLost: number;
    readonly completedGames: Omit<CompletedGameType, 'dailyDayNumber'>[];
}

export interface LegacyGameStateInterface extends CurrentRunType {
    readonly historyByDifficulty: Record<DifficultyEnum, LegacyHistoryInterface>;
    readonly techniqueUsageCounts: PlayerStatsType['techniqueUsageCounts'];
    readonly playedDayNumbers: readonly number[];
    readonly dailyCompletedDayNumbers: readonly number[];
    readonly dailyBestStreak: number;
}

export interface LegacyRootStateInterface {
    readonly game: LegacyGameStateInterface;
    readonly settings: SettingsType;
    readonly customThemes: {
        readonly themes: readonly (Omit<CustomThemeType, 'colors' | 'sourceTheme'> & {
            readonly colors: Record<string, unknown>;
            readonly sourceTheme: string;
        })[];
    };
}
